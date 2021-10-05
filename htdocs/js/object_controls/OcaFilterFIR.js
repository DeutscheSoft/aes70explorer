import { TemplateComponent, DynamicValue } from '../../AWML/src/index.pure.js';
import { matchClass } from '../utils/match_class.js';
import { registerObjectControlTemplate } from '../object_controls.js';
import { sprintf } from '../../aux-widgets/src/utils/sprintf.js';
import { coefToFreq } from '../../aux-widgets/src/utils/audiomath.js';
import { makeValueMinMaxBinding, limitValueDigits } from '../utils.js';

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

function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    var reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function() {
      resolve(reader.result);
    };
    reader.onerror = function (err) {
      reject(reader.error);
    };
  });
}

async function parseCSV(file) {
  const text = await readFileAsText(file);
  let arr = text.split(/[^0-9.\-]/g);
  arr = arr.filter(v => v !== '');
  arr = arr.map(v => parseFloat(v));

  if (arr.length > 2048)
    throw new Error('Too many coefficients (' + arr.length + '/2048)');

  return {
    data: arr,
  };
}

function readFileAsArrayBuffer(file) {
  return new Promise((resolve, reject) => {
    var reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = function() {
      resolve(reader.result);
    };
    reader.onerror = function (err) {
      reject(reader.error);
    };
  });
}

async function parseWAV(file) {
  const data = await readFileAsArrayBuffer(file);
  const uint8 = new Uint8Array(data);

  // test if RIFF/WAV
  if (String.fromCharCode(...uint8.slice(0, 4)) !== 'RIFF')
    throw new Error('File is not a RIFF container');

  if (String.fromCharCode(...uint8.slice(8, 12)) !== 'WAVE')
    throw new Error('File is not of type WAVE');

  if (String.fromCharCode(...uint8.slice(12, 16)) !== 'fmt ')
    throw new Error('File is not a valid WAV file');

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
  const ab = await context.decodeAudioData(uint8.buffer);
  const floats = ab.getChannelData(0);

  if (floats.length > 2048)
    throw new Error('Too many coefficients (' + floats.length + '/2048)');

  return {
    data: floats,
    srate: srate,
  };
}

function coefToDots(coef, srate, pixels) {
  const dots = [];
  for (let i = 0; i < pixels; ++i) {
    const F = coefToFreq(i / pixels, 20, 20000);
    const w = F / srate * 2 * Math.PI;
    let ReH = 0, ImH = 0;
    for (let j = 0, m = coef.length; j < m; ++j) {
      const C = coef[j];
      ReH += C * Math.cos(j * w);
      ImH += C * Math.sin(j * w);
    }
    ReH *= ReH;
    ImH *= ImH;
    const y = 10 * Math.log10(Math.sqrt(ReH + ImH));
    dots.push({x: F, y: y});
  }
  return dots;
}

function calculateResponse(args) {
  return function (graph) {
    const pixels = graph.range_x.options.basis;
    return coefToDots(args[0], args[1], pixels);
  }
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

      try {
        let res;

        if (file.type.startsWith('text/'))
          res = await parseCSV(file);
        else
          res = await parseWAV(file);

        await this._controlObject.SetCoefficients(res.data);

        if (res.srate)
          await this._controlObject.SetSampleRate(res.srate);
      } catch (err) {
        console.error(err);
        AES70.notify(err.toString(), 'error');
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
