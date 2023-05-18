import {
  GpioMapping,
  MatrixOptions,
  MuxType,
  RowAddressType,
  RuntimeFlag,
  RuntimeOptions,
  ScanMode,
} from "rpi-led-matrix";

export const matrixOptions: MatrixOptions = {
  brightness: 100,
  chainLength: 4,
  rows: 32,
  cols: 64,
  parallel: 3,
  pwmDitherBits: 1,
  pwmBits: 8,
  hardwareMapping: GpioMapping.Regular,
  limitRefreshRateHz: 144,
  disableHardwarePulsing: false,
  inverseColors: false,
  ledRgbSequence: "RGB",
  multiplexing: MuxType.Direct,
  panelType: "",
  pixelMapperConfig: "",
  pwmLsbNanoseconds: 130,
  rowAddressType: RowAddressType.Direct,
  scanMode: ScanMode.Progressive,
  showRefreshRate: false,
};

export const runtimeOptions: RuntimeOptions = {
  // @ts-ignore
  gpioSlowdown: 5,
  daemon: RuntimeFlag.Off,
  doGpioInit: true,
  dropPrivileges: RuntimeFlag.On,
};
