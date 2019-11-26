// Copyright 2018 Superblocks AB
//
// This file is part of Superblocks Lab.
//
// Superblocks Lab is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation version 3 of the License.
//
// Superblocks Lab is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Superblocks Lab.  If not, see <http://www.gnu.org/licenses/>.

const assert = require("assert");
const fs = require("fs");
const path = require("path");
const JSZip = require("jszip");

describe('solc', function() {
    this.timeout(10000);

    // Template file paths
    const emptyTemplatePath = "./src/templates/empty.zip";
    const helloWorldTemplatePath = "./src/templates/hello.zip";
    const newsFeedTemplatePath = "./src/templates/newsfeed.zip";
    const raiseToSummonTemplatePath = "./src/templates/raisetosummon.zip";

    // Compiler settings
    const compilerPath = "../src/components/solc/dist/soljson-v0.5.10.js"
    const compiler = require(compilerPath);
    const wrapper = require("solc/wrapper");
    const compileWrapper = wrapper(compiler);
    const compile = compileWrapper.compileStandardWrapper;

    // Reference example
    const referenceDummyContract = read_file("./reference/dummy/Dummy.sol").toString();
    const referenceDummyBin = read_file("./reference/dummy/Dummy.bin").toString();
    const referenceDummyABI = JSON.parse(JSON.stringify(read_file("./reference/dummy/Dummy.abi").toString()));
    const referenceEmptyBin = read_file("./reference/empty/MyContract.bin").toString();
    const referenceEmptyABI = JSON.parse(JSON.stringify(read_file("./reference/empty/MyContract.abi").toString()));
    const referenceHelloBin = read_file("./reference/hello/HelloWorld.bin").toString();
    const referenceHelloABI = JSON.parse(JSON.stringify(read_file("./reference/hello/HelloWorld.abi").toString()));
    const referenceNewsFeedBin = read_file("./reference/newsfeed/NewsFeed.bin").toString();
    const referenceNewsFeedABI = JSON.parse(JSON.stringify(read_file("./reference/newsfeed/NewsFeed.abi").toString()));
    const referenceRaiseToSummonBin = read_file("./reference/raisetosummon/RaiseToSummon.bin").toString();
    const referenceRaiseToSummonABI = JSON.parse(JSON.stringify(read_file("./reference/raisetosummon/RaiseToSummon.abi").toString()));

    // Helper functions
    function read_file(file) {
        return fs.readFileSync(path.resolve(__dirname, file));
    }

    function call_compile(fileContents,
            expectedContractsLength, expectedSourcesLength, expectedErrorsLength,
            expectedContractFileName, expectedSourcesFileName, expectedContractName,
            expectedContractBytecode, expectedContractMetadataABI, expectedContractMetadataLanguage, expectedContractMetadataEvmVersion, expectedContractMetadataOptimizerEnabled, expectedContractMetadataOptimizerRuns) {
        var input = {
            language: "Solidity",
            sources: {},
            settings: {
                optimizer: {
                    enabled: false,
                    runs: 200
                },
                evmVersion: "byzantium",
                libraries: {
                },
                outputSelection: {
                    "*": {
                        "*": ["metadata", "evm.bytecode", "evm.gasEstimates"]
                    }
                }
            }
        };

        input.sources[expectedContractFileName] = { content: fileContents };
        const output = JSON.parse(compile(JSON.stringify(input)));

        //
        // Check data length settings
        if(expectedErrorsLength > 0) {
            assert.strictEqual(output.errors.length, expectedErrorsLength);
        } else {
            assert.strictEqual(output.errors, undefined);
        }
        assert.strictEqual(Object.keys(output.contracts).length, expectedContractsLength);
        assert.strictEqual(Object.keys(output.sources).length, expectedSourcesLength);

        //
        // Check contract and file name settings
        assert.ok(output.contracts[expectedContractFileName], "Expected contract file name to exist");
        assert.ok(output.sources[expectedContractFileName], expectedSourcesFileName);
        assert.strictEqual(Object.keys(output.contracts[expectedContractFileName])[0], expectedContractName);

        //
        // Check expected output
        const data = output.contracts[expectedContractFileName][expectedContractName];
        const metadata = JSON.parse(data.metadata);

        for(var i=0;i<data.evm.bytecode.object.length;i++) {
            assert.strictEqual(data.evm.bytecode.object[i], expectedContractBytecode[i]);
        }

        const abi = JSON.stringify(metadata.output.abi);
        for(var i=0; i< abi.length; i++) {
            assert.strictEqual(abi[i], expectedContractMetadataABI[i]);
        }

        assert.strictEqual(metadata.language, expectedContractMetadataLanguage);
        assert.strictEqual(metadata.settings.evmVersion, expectedContractMetadataEvmVersion);
        assert.strictEqual(metadata.settings.optimizer.enabled, expectedContractMetadataOptimizerEnabled);
        assert.strictEqual(metadata.settings.optimizer.runs, expectedContractMetadataOptimizerRuns);
    }

    function loadContractInZip(path, contractName, callback) {
        fs.readFile(path, function(err, data) {
            if (err) {
                callback(err);
            }
            JSZip.loadAsync(data).then(function(zip) {
                return zip.file("contracts/"+ contractName).async("string");
            }).then(function (result) {
                callback(null, result);
            });
        });
    }

    it('should compile a simple contract', function() {
        const fileContents = referenceDummyContract;

        // Expected data length settings
        const expectedContractsLength = 1;
        const expectedSourcesLength = 1;
        const expectedErrorsLength = 0;

        // Expected contract and file name settings
        const expectedContractFileName = "Dummy.sol";
        const expectedSourcesFileName = "Dummy.sol";
        const expectedContractName = "dummy";

        // Other expected output
        const expectedContractBytecode = referenceDummyBin;
        const expectedContractMetadataABI = referenceDummyABI;
        const expectedContractMetadataLanguage = "Solidity";
        const expectedContractMetadataEvmVersion = "byzantium";
        const expectedContractMetadataOptimizerEnabled = false;
        const expectedContractMetadataOptimizerRuns = 200;

        call_compile(fileContents,
            expectedContractsLength, expectedSourcesLength, expectedErrorsLength,
            expectedContractFileName, expectedSourcesFileName, expectedContractName,
            expectedContractBytecode, expectedContractMetadataABI, expectedContractMetadataLanguage, expectedContractMetadataEvmVersion, expectedContractMetadataOptimizerEnabled, expectedContractMetadataOptimizerRuns);
    });

    it('should compile Empty template', function(done) {
        // Expected data length settings
        const expectedContractsLength = 1;
        const expectedSourcesLength = 1;
        const expectedErrorsLength = 0;

        // Expected contract and file name settings
        const expectedContractFileName = "MyContract.sol";
        const expectedSourcesFileName = "MyContract.sol";
        const expectedContractName = "MyContract";

        // Other expected output
        const expectedContractBytecode = referenceEmptyBin;
        const expectedContractMetadataABI = referenceEmptyABI;
        const expectedContractMetadataLanguage = "Solidity";
        const expectedContractMetadataEvmVersion = "byzantium";
        const expectedContractMetadataOptimizerEnabled = false;
        const expectedContractMetadataOptimizerRuns = 200;

        loadContractInZip(emptyTemplatePath, expectedContractFileName, function(err, fileContents) {
            call_compile(fileContents,
                expectedContractsLength, expectedSourcesLength, expectedErrorsLength,
                expectedContractFileName, expectedSourcesFileName, expectedContractName,
                expectedContractBytecode, expectedContractMetadataABI, expectedContractMetadataLanguage, expectedContractMetadataEvmVersion, expectedContractMetadataOptimizerEnabled, expectedContractMetadataOptimizerRuns);
            done();
        });
    });

    it('should compile Hello World template', function(done) {
        // Expected data length settings
        const expectedContractsLength = 1;
        const expectedSourcesLength = 1;
        const expectedErrorsLength = 0;

        // Expected contract and file name settings
        const expectedContractFileName = "HelloWorld.sol";
        const expectedSourcesFileName = "HelloWorld.sol";
        const expectedContractName = "HelloWorld";

        // Other expected output
        const expectedContractBytecode = referenceHelloBin;
        const expectedContractMetadataABI = referenceHelloABI;
        const expectedContractMetadataLanguage = "Solidity";
        const expectedContractMetadataEvmVersion = "byzantium";
        const expectedContractMetadataOptimizerEnabled = false;
        const expectedContractMetadataOptimizerRuns = 200;

        loadContractInZip(helloWorldTemplatePath, expectedContractFileName, function(err, fileContents) {
            call_compile(fileContents,
                expectedContractsLength, expectedSourcesLength, expectedErrorsLength,
                expectedContractFileName, expectedSourcesFileName, expectedContractName,
                expectedContractBytecode, expectedContractMetadataABI, expectedContractMetadataLanguage, expectedContractMetadataEvmVersion, expectedContractMetadataOptimizerEnabled, expectedContractMetadataOptimizerRuns);
            done();
        });
    });

    it('should compile Uncensorable News Feed template', function(done) {
        // Expected data length settings
        const expectedContractsLength = 1;
        const expectedSourcesLength = 1;
        const expectedErrorsLength = 0;

        // Expected contract and file name settings
        const expectedContractFileName = "NewsFeed.sol";
        const expectedSourcesFileName = "NewsFeed.sol";
        const expectedContractName = "NewsFeed";

        // Other expected output
        const expectedContractBytecode = referenceNewsFeedBin;
        const expectedContractMetadataABI = referenceNewsFeedABI;
        const expectedContractMetadataLanguage = "Solidity";
        const expectedContractMetadataEvmVersion = "byzantium";
        const expectedContractMetadataOptimizerEnabled = false;
        const expectedContractMetadataOptimizerRuns = 200;

        loadContractInZip(newsFeedTemplatePath, expectedContractFileName, function(err, fileContents) {
            call_compile(fileContents,
                expectedContractsLength, expectedSourcesLength, expectedErrorsLength,
                expectedContractFileName, expectedSourcesFileName, expectedContractName,
                expectedContractBytecode, expectedContractMetadataABI, expectedContractMetadataLanguage, expectedContractMetadataEvmVersion, expectedContractMetadataOptimizerEnabled, expectedContractMetadataOptimizerRuns);
            done();
        });
    });

    it('should compile Raise to Summon template', function(done) {
        // Expected data length settings
        const expectedContractsLength = 1;
        const expectedSourcesLength = 1;
        const expectedErrorsLength = 0;

        // Expected contract and file name settings
        const expectedContractFileName = "RaiseToSummon.sol";
        const expectedSourcesFileName = "RaiseToSummon.sol";
        const expectedContractName = "RaiseToSummon";

        // Other expected output
        const expectedContractBytecode = referenceRaiseToSummonBin;
        const expectedContractMetadataABI = referenceRaiseToSummonABI;
        const expectedContractMetadataLanguage = "Solidity";
        const expectedContractMetadataEvmVersion = "byzantium";
        const expectedContractMetadataOptimizerEnabled = false;
        const expectedContractMetadataOptimizerRuns = 200;

        loadContractInZip(raiseToSummonTemplatePath, expectedContractFileName, function(err, fileContents) {
            call_compile(fileContents,
                expectedContractsLength, expectedSourcesLength, expectedErrorsLength,
                expectedContractFileName, expectedSourcesFileName, expectedContractName,
                expectedContractBytecode, expectedContractMetadataABI, expectedContractMetadataLanguage, expectedContractMetadataEvmVersion, expectedContractMetadataOptimizerEnabled, expectedContractMetadataOptimizerRuns);
            done();
        });
    });
});
