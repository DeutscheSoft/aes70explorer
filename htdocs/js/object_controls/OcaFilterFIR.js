import { TemplateComponent, DynamicValue } from '../../AWML/src/index.pure.js';
import { matchClass } from '../utils/match_class.js';
import { registerObjectControlTemplate } from '../object_controls.js';
import { sprintf } from '../../aux-widgets/src/utils/sprintf.js';
import { coefToFreq } from '../../aux-widgets/src/utils/audiomath.js';
import { makeValueMinMaxBinding, limitValueDigits } from '../utils.js';

const PIXELS = 320;

const template = `
<aux-label class="label" %bind={{ this.labelBindings }}></aux-label>
<aux-label class="srate" label="Sample Rate (Hz)"></aux-label>
<aux-value %bind={{ this.srateBindings }}></aux-value>
<aux-fileselect
  #fileselect
  accept=".csv,.wav"
  placeholder="Select Coefficients WAV or CSV"
  button.icon="folder"
  (select)={{ this.fileSelected }}
  ></aux-fileselect>
<aux-frequencyresponse
  #response
  %bind={{ this.responseBindings }}>
  <aux-chart-graph
    #graph
    %bind={{ this.graphBindings }}>
  </aux-chart-graph>
</aux-frequencyresponse>
`;

function parseCSV(file) {
  return new Promise(resolve => {
    var reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function() {
      const text = reader.result;
      let arr = text.split(/[^0-9.\-]/g);
      arr = arr.filter(v => v !== '');
      arr = arr.map(v => parseFloat(v));
      if (arr.length > 2048) {
        resolve({
          data: [],
          error: 'Too many coefficients (' + arr.length + '/2048)',
        });
      }
      resolve({
        data: arr,
      });
    };
    reader.onerror = function () {
      resolve({
        error: reader.error,
        data: []
      });
    }
  });
}

function parseWAV(file) {
  return new Promise(resolve => {
    var reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = function() {
      
      // test if RIFF/WAV
      const uint8 = new Uint8Array(reader.result);
      if (String.fromCharCode(...uint8.slice(0, 4)) !== 'RIFF')
        resolve({
          data: [],
          error: 'File is not a RIFF container',
        });
      if (String.fromCharCode(...uint8.slice(8, 12)) !== 'WAVE')
        resolve({
          data: [],
          error: 'File is not of type WAVE',
        });
      if (String.fromCharCode(...uint8.slice(12, 16)) !== 'fmt ')
        resolve({
          data: [],
          error: 'File is not a valid WAV file',
        });
      // get number of channels
      const channels = new Uint16Array(uint8.slice(22, 24).buffer)[0];
      // get sample rate
      const srate = new Uint32Array(uint8.slice(24, 28).buffer)[0];
      // create offline context
      const context = new OfflineAudioContext({
        numberOfChannels: channels,
        length: channels * srate * 2048,
        sampleRate: srate,
      });
      // decode audio to float32
      context.decodeAudioData(reader.result).then(ab => {
        const floats = ab.getChannelData(0);
        if (floats.length > 2048) {
          resolve({
            data: [],
            error: 'Too many coefficients (' + floats.length + '/2048)',
          });
        }
        resolve({
          data: floats,
          srate: srate,
        });
      }, () => {
        resolve({
          data: [],
          error: 'Decoding samples failed',
        });
      });
    };
    reader.onerror = function (e) {
      resolve({
        data: [],
        error: reader.error,
      });
    }
  });
}

/*
H(w) = Sum_0^N h(n) * ( cos(nw) - i * sin(nw) )
     = Sum_0^N h(n) * cos(nw) + i * Sum_0^N h(n) * sin(nw) 

w = f / f_S * 2 * PI

ReH(w) = Sum_0^N h(n) * cos(nw)
ImH(w) = Sum_0^N h(n) * sin(nw)

|H(w)| = Sqrt( ReH(w)^2 + ImH(w)^2 )

*/

function coefToDots(coef, srate) {
  const dots = [];
  for (let i = 0; i < PIXELS; ++i) {
    const F = coefToFreq(i / PIXELS, 20, 20000);
    const w = F / srate * 2 * Math.PI;
    let ReH = 0, ImH = 0;
    for (let j = 0, m = coef.length; j < m; ++j) {
      const C = coef[j];
      ReH += C * Math.cos(j * w);
      ImH += C * Math.sin(j * w);
    }
    const y = Math.sqrt(Math.pow(ReH, 2) + Math.pow(ImH, 2));
    dots.push({x: F, y: y});
  }
  return dots;
}

function calculateResponse(args) {
  return coefToDots(...args);
}

class OcaFilterFIRControl extends TemplateComponent.fromString(template) {
  constructor() {
    super();
    this.knobPresets = DynamicValue.fromConstant(AES70.knobPresets);
    this.formatValueBinding = DynamicValue.fromConstant(limitValueDigits(4));
    
    this.labelBindings = [
      {
        src: '/Role',
        name: 'label',
        readonly: true,
      },
    ];
    this.srateBindings = [
      {
        src: '/SampleRate',
        name: 'value',
        sync: true,
      },
    ];
    this.graphBindings = [
      {
        src: ['/Coefficients', '/SampleRate'],
        name: 'dots',
        transformReceive: calculateResponse,
      },
    ];
    
    this.fileSelected = async (e) => {
      const fsel = this.fileselect.auxWidget;
      const files = fsel.get('files');
      if (!files.length)
        return;
      const file = files[0];
      let res;
      if (file.type == 'text/csv')
        res = await parseCSV(file);
      else
        res = await parseWAV(file);
      if (res.error) {
        AES70.notify(res.error, 'error');
      } else {
        this._controlObject.SetCoefficients(res.data);
        if (res.srate)
          this._controlObject.SetSampleRate(res.srate);
      }
      setTimeout((()=>{
        this.fileselect.auxWidget.set('files', []);
      }).bind(this), 1000);
    }
  }
  static match(o) {
    return matchClass(OCA.RemoteControlClasses.OcaFilterFIR, o)
  }
  setControlObject(o) {
    this._controlObject = o;
  }
}

registerObjectControlTemplate(OcaFilterFIRControl, 'filterfir');
