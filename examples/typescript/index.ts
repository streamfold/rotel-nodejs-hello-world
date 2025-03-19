import { Rotel } from 'rotel-agent';
import * as RotelConfig from 'rotel-agent/config'

let exp: RotelConfig.OTLPExporter = {
  endpoint: "http://foo.example.com"
}

let options: RotelConfig.Options = {
  enabled: true,
  exporter: {
    traces: exp,
  }
  
}
new Rotel(options).start();
