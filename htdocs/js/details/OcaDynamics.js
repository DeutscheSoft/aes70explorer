import { TemplateComponent, DynamicValue } from '../../AWML/src/index.pure.js';
import { matchClass, registerTemplateDetails } from '../template_components.js';
import { makeImplementedBindings } from '../utils.js';

const template = `
<div class="grid">
  <span %if={{ this.implementsLabel }} class="label">Label</span>
  <aux-value %if={{ this.implementsLabel }} preset=string %bind={{ this.LabelBind }}></aux-value>

  <span class="label">Enabled</span>
  <aux-toggle icon=enabled %bind={{ this.EnabledBind }}></aux-toggle>

  <span class="label">ClassVersion</span>
  <aux-label %bind={{ this.ClassVersionBind }}></aux-label>

  <span class="label">Lockable</span>
  <aux-label %bind={{ this.LockableBind }}></aux-label>

  <span class="label">Triggered</span>
  <aux-state %bind={{ this.TriggeredBind }}></aux-state>

  <span class="label">DynamicGain</span>
  <aux-label %bind={{ this.DynamicGainBind }}></aux-label>

  <span class="label">Threshold Min</span>
  <aux-label %bind={{ this.ThresholdMinBind }}></aux-label>

  <span class="label">Threshold Max</span>
  <aux-label %bind={{ this.ThresholdMaxBind }}></aux-label>

  <span class="label">Threshold</span>
  <aux-label %bind={{ this.ThresholdBind }}></aux-label>
  
  <span %if={{ this.implementsSlope }} class="label">Slope Min</span>
  <aux-label %if={{ this.implementsSlope }} %bind={{ this.SlopeMinBind }}></aux-label>

  <span %if={{ this.implementsSlope }} class="label">Slope Max</span>
  <aux-label %if={{ this.implementsSlope }} %bind={{ this.SlopeMaxBind }}></aux-label>

  <span %if={{ this.implementsSlope }} class="label">Slope</span>
  <aux-label %if={{ this.implementsSlope }} %bind={{ this.SlopeBind }}></aux-label>
  
  <span %if={{ this.implementsRatio }} class="label">Ratio Min</span>
  <aux-label %if={{ this.implementsRatio }} %bind={{ this.RatioMinBind }}></aux-label>

  <span %if={{ this.implementsRatio }} class="label">Ratio Max</span>
  <aux-label %if={{ this.implementsRatio }} %bind={{ this.RatioMaxBind }}></aux-label>

  <span %if={{ this.implementsRatio }} class="label">Ratio</span>
  <aux-label %if={{ this.implementsRatio }} %bind={{ this.RatioBind }}></aux-label>
</div>
<div class="grid">
  <span class="label">Attack Min</span>
  <aux-label %bind={{ this.AttackMinBind }}></aux-label>

  <span class="label">Attack Max</span>
  <aux-label %bind={{ this.AttackMaxBind }}></aux-label>

  <span class="label">Attack</span>
  <aux-label %bind={{ this.AttackBind }}></aux-label>
  
  <span class="label">Release Min</span>
  <aux-label %bind={{ this.ReleaseMinBind }}></aux-label>

  <span class="label">Release Max</span>
  <aux-label %bind={{ this.ReleaseMaxBind }}></aux-label>

  <span class="label">Release</span>
  <aux-label %bind={{ this.ReleaseBind }}></aux-label>
  
  <span class="label">Hold Min</span>
  <aux-label %bind={{ this.HoldMinBind }}></aux-label>

  <span class="label">Hold Max</span>
  <aux-label %bind={{ this.HoldMaxBind }}></aux-label>

  <span class="label">Hold</span>
  <aux-label %bind={{ this.HoldBind }}></aux-label>
</div>
<div class="grid">
  <span class="label">Knee Min</span>
  <aux-label %bind={{ this.KneeMinBind }}></aux-label>

  <span class="label">Knee Max</span>
  <aux-label %bind={{ this.KneeMaxBind }}></aux-label>

  <span class="label">Knee</span>
  <aux-label %bind={{ this.KneeBind }}></aux-label>
  
  <span class="label">Dyn Gain Ceiling Min</span>
  <aux-label %bind={{ this.DynamicGainCeilingMinBind }}></aux-label>

  <span class="label">Dyn Gain Ceiling Max</span>
  <aux-label %bind={{ this.DynamicGainCeilingMaxBind }}></aux-label>

  <span class="label">Dyn Gain Ceiling</span>
  <aux-label %bind={{ this.DynamicGainCeilingBind }}></aux-label>
  
  <span class="label">Dyn Gain Floor Min</span>
  <aux-label %bind={{ this.DynamicGainFloorMinBind }}></aux-label>

  <span class="label">Dyn Gain Floor Max</span>
  <aux-label %bind={{ this.DynamicGainFloorMaxBind }}></aux-label>

  <span class="label">Dyn Gain Floor</span>
  <aux-label %bind={{ this.DynamicGainFloorBind }}></aux-label>
  
  <span class="label">Function</span>
  <aux-label %bind={{ this.FunctionBind }}></aux-label>
  
  <span class="label">Detector Law</span>
  <aux-label %bind={{ this.DetectorLawBind }}></aux-label>
</div>
`;

class OcaDynamicsDetails extends TemplateComponent.fromString(template) {
  static getHostBindings() {
    return makeImplementedBindings([
      'Label',
      'Ratio',
      'Slope',
    ]);
  }
  
  constructor() {
    super();

    this.LabelBind = [{ src: '/Label', name: 'value' }];
    this.ClassVersionBind = [{ src: '/ClassVersion', name: 'label' }];
    this.LockableBind = [{ src: '/Lockable', name: 'label' }];
    this.EnabledBind = [{ src: '/Enabled', name: 'state' }];
    
    this.ThresholdBind = [{ src: '/Threshold', name: 'label',
      transformReceive: v => v.Ref.toFixed(3) + 'dB' }];
      
    this.ThresholdBind = [{ src: '/Threshold', name: 'label',
      transformReceive: v => v.Value.toFixed(3) + 'dB' }];
    this.ThresholdMinBind = [{ src: '/Threshold/Min', name: 'label',
      transformReceive: v => v.toFixed(3) + 'dB' }];
    this.ThresholdMaxBind = [{ src: '/Threshold/Max', name: 'label',
      transformReceive: v => v.toFixed(3) + 'dB' }];
    
    this.SlopeBind = [{ src: '/Slope', name: 'label',
      transformReceive: v => v.toFixed(3) + ':1' }];
    this.SlopeMinBind = [{ src: '/Slope/Min', name: 'label',
      transformReceive: v => v.toFixed(3) + ':1' }];
    this.SlopeMaxBind = [{ src: '/Slope/Max', name: 'label',
      transformReceive: v => v.toFixed(3) + ':1' }];
    
    this.RatioBind = [{ src: '/Ratio', name: 'label',
      transformReceive: v => v.toFixed(3) + ':1' }];
    this.RatioMinBind = [{ src: '/Ratio/Min', name: 'label',
      transformReceive: v => v.toFixed(3) + ':1' }];
    this.RatioMaxBind = [{ src: '/Ratio/Max', name: 'label',
      transformReceive: v => v.toFixed(3) + ':1' }];
      
     this.KneeBind = [{ src: '/KneeParameter', name: 'label',
      transformReceive: v => v.toFixed(3) }];
    this.KneeMinBind = [{ src: '/KneeParameter/Min', name: 'label',
      transformReceive: v => v.toFixed(3) }];
    this.KneeMaxBind = [{ src: '/KneeParameter/Max', name: 'label',
      transformReceive: v => v.toFixed(3) }];
    
    this.AttackBind = [{ src: '/AttackTime', name: 'label',
      transformReceive: v => v.toFixed(3) + 's' }];
    this.AttackMinBind = [{ src: '/AttackTime/Min', name: 'label',
      transformReceive: v => v.toFixed(3) + 's' }];
    this.AttackMaxBind = [{ src: '/AttackTime/Max', name: 'label',
      transformReceive: v => v.toFixed(3) + 's' }];
    
    this.ReleaseBind = [{ src: '/ReleaseTime', name: 'label',
      transformReceive: v => v.toFixed(3) + 's' }];
    this.ReleaseMinBind = [{ src: '/ReleaseTime/Min', name: 'label',
      transformReceive: v => v.toFixed(3) + 's' }];
    this.ReleaseMaxBind = [{ src: '/ReleaseTime/Max', name: 'label',
      transformReceive: v => v.toFixed(3) + 's' }];
    
    this.HoldBind = [{ src: '/HoldTime', name: 'label',
      transformReceive: v => v.toFixed(3) + 's' }];
    this.HoldMinBind = [{ src: '/HoldTime/Min', name: 'label',
      transformReceive: v => v.toFixed(3) + 's' }];
    this.HoldMaxBind = [{ src: '/HoldTime/Max', name: 'label',
      transformReceive: v => v.toFixed(3) + 's' }];
      
      
    this.DynamicGainCeilingBind = [{ src: '/DynamicGainCeiling', name: 'label',
      transformReceive: v => v.toFixed(3) + 'dB' }];
    this.DynamicGainCeilingMinBind = [{ src: '/DynamicGainCeiling/Min', name: 'label',
      transformReceive: v => v.toFixed(3) + 'dB' }];
    this.DynamicGainCeilingMaxBind = [{ src: '/DynamicGainCeiling/Max', name: 'label',
      transformReceive: v => v.toFixed(3) + 'dB' }];
      
    this.DynamicGainFloorBind = [{ src: '/DynamicGainFloor', name: 'label',
      transformReceive: v => v.toFixed(3) + 'dB' }];
    this.DynamicGainFloorMinBind = [{ src: '/DynamicGainFloor/Min', name: 'label',
      transformReceive: v => v.toFixed(3) + 'dB' }];
    this.DynamicGainFloorMaxBind = [{ src: '/DynamicGainFloor/Max', name: 'label',
      transformReceive: v => v.toFixed(3) + 'dB' }];
    
    this.FunctionBind = [{ src: '/Function', name: 'label',
      transformReceive: v => v.name }];
    this.DetectorLawBind = [{ src: '/DetectorLaw', name: 'label',
      transformReceive: v => v.name }];
    this.DynamicGainBind = [{ src: '/DynamicGain', name: 'label',
      transformReceive: v => v.toFixed(3) + 'dB' }];
  }
  static match(o) {
    return matchClass(OCA.RemoteControlClasses.OcaDynamics, o);
  }
}

registerTemplateDetails(OcaDynamicsDetails, 'dynamics');
