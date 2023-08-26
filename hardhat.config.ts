import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "tsconfig-paths/register";

const config: HardhatUserConfig = {
  solidity: "0.8.19",
  mocha :{
    parallel:true,
    reporter: 'mocha-multi-reporters',
    reporterOptions : {
      reporterEnabled : 'spec, @reportportal/agent-js-mocha',
      mochaFile: 'output.xml',
      reportportalAgentJsMochaReporterOptions : {
        "apiKey": "aPSnNhrAEab9RNb5Xlm4BcZWwh4",
        "endpoint": "http://localhost:8080/api/v1",
        "project": "superadmin_personal",
        "launch": "solidLaunch",
        "timeout": 250000,
        "attributes": [
          {
            "key": "YourKey",
            "value": "YourValue"
          },
          {
            "value": "YourValue"
          },
        ]

      }
    }
    
   
  }
  
  
  
  
};

export default config;