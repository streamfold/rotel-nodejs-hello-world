import { Rotel } from "@streamfold/rotel";
import { Client } from "@streamfold/rotel/client";

import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc';
import { trace } from '@opentelemetry/api';
import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions';
import {resourceFromAttributes} from '@opentelemetry/resources';

function initRotel(): Client {
  const dataset = process.env.AXIOM_DATASET;
  if (dataset === undefined) {
    throw new Error("environment variable AXIOM_DATASET is undefined");
  }
  const rotel = new Rotel({
    enabled: true,
    exporter: {
      endpoint: "https://api.axiom.co",
      protocol: "http",
      headers: {
        "Authorization": "Bearer " + process.env.AXIOM_API_TOKEN,
        "X-Axiom-Dataset": dataset
      }
    },
  })
  return rotel;
}

function initOtel(): NodeTracerProvider {
  const exporter = new OTLPTraceExporter({                                                                                                                   
    url: 'http://127.0.0.1:4317', // points to out local rotel collector                                                                                                                    
  });                                                                                                                                                  
                                                                                                                                                     
  // Initialize the tracer provider                                                                                                                    
  const provider = new NodeTracerProvider({
    resource: resourceFromAttributes({
      [ATTR_SERVICE_NAME]: 'rotel-nodejs-service',
    }),
    spanProcessors: [
        new SimpleSpanProcessor(exporter)
    ],
  });

  // Register the provider as the global tracer provider
  provider.register();
  return provider;
}

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Main routine
  async function main() {
  const rotel = initRotel();
  const provider = initOtel();
  rotel.start();
  console.log("Hello from example");
  const tracer = trace.getTracer('rotel-node-ts-hello-world');
  console.log("starting main span");
  const mainSpan = tracer.startSpan('main');
  // sleep for a second to simulate span start/end time
  await sleep(1000);
  mainSpan.end();
  console.log("main span ended, flushing")
  await provider.forceFlush();
  await provider.shutdown();
  rotel.stop();
  console.log("goodbye")
}

main();

