const { Rotel } = require("rotel-agent");

const rotel = new Rotel({
  enabled: true,
  exporter: {
      endpoint: "https://foo.example.com",
      headers: {
          "x-api-key" : "xxxxx",
          "x-data-set": "testing"
      }
    },
})
rotel.start()
