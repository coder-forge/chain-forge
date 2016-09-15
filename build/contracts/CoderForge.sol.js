var Web3 = require("web3");
var SolidityEvent = require("web3/lib/web3/event.js");

(function() {
  // Planned for future features, logging, etc.
  function Provider(provider) {
    this.provider = provider;
  }

  Provider.prototype.send = function() {
    this.provider.send.apply(this.provider, arguments);
  };

  Provider.prototype.sendAsync = function() {
    this.provider.sendAsync.apply(this.provider, arguments);
  };

  var BigNumber = (new Web3()).toBigNumber(0).constructor;

  var Utils = {
    is_object: function(val) {
      return typeof val == "object" && !Array.isArray(val);
    },
    is_big_number: function(val) {
      if (typeof val != "object") return false;

      // Instanceof won't work because we have multiple versions of Web3.
      try {
        new BigNumber(val);
        return true;
      } catch (e) {
        return false;
      }
    },
    merge: function() {
      var merged = {};
      var args = Array.prototype.slice.call(arguments);

      for (var i = 0; i < args.length; i++) {
        var object = args[i];
        var keys = Object.keys(object);
        for (var j = 0; j < keys.length; j++) {
          var key = keys[j];
          var value = object[key];
          merged[key] = value;
        }
      }

      return merged;
    },
    promisifyFunction: function(fn, C) {
      var self = this;
      return function() {
        var instance = this;

        var args = Array.prototype.slice.call(arguments);
        var tx_params = {};
        var last_arg = args[args.length - 1];

        // It's only tx_params if it's an object and not a BigNumber.
        if (Utils.is_object(last_arg) && !Utils.is_big_number(last_arg)) {
          tx_params = args.pop();
        }

        tx_params = Utils.merge(C.class_defaults, tx_params);

        return new Promise(function(accept, reject) {
          var callback = function(error, result) {
            if (error != null) {
              reject(error);
            } else {
              accept(result);
            }
          };
          args.push(tx_params, callback);
          fn.apply(instance.contract, args);
        });
      };
    },
    synchronizeFunction: function(fn, instance, C) {
      var self = this;
      return function() {
        var args = Array.prototype.slice.call(arguments);
        var tx_params = {};
        var last_arg = args[args.length - 1];

        // It's only tx_params if it's an object and not a BigNumber.
        if (Utils.is_object(last_arg) && !Utils.is_big_number(last_arg)) {
          tx_params = args.pop();
        }

        tx_params = Utils.merge(C.class_defaults, tx_params);

        return new Promise(function(accept, reject) {

          var decodeLogs = function(logs) {
            return logs.map(function(log) {
              var logABI = C.events[log.topics[0]];

              if (logABI == null) {
                return null;
              }

              var decoder = new SolidityEvent(null, logABI, instance.address);
              return decoder.decode(log);
            }).filter(function(log) {
              return log != null;
            });
          };

          var callback = function(error, tx) {
            if (error != null) {
              reject(error);
              return;
            }

            var timeout = C.synchronization_timeout || 240000;
            var start = new Date().getTime();

            var make_attempt = function() {
              C.web3.eth.getTransactionReceipt(tx, function(err, receipt) {
                if (err) return reject(err);

                if (receipt != null) {
                  // If they've opted into next gen, return more information.
                  if (C.next_gen == true) {
                    return accept({
                      tx: tx,
                      receipt: receipt,
                      logs: decodeLogs(receipt.logs)
                    });
                  } else {
                    return accept(tx);
                  }
                }

                if (timeout > 0 && new Date().getTime() - start > timeout) {
                  return reject(new Error("Transaction " + tx + " wasn't processed in " + (timeout / 1000) + " seconds!"));
                }

                setTimeout(make_attempt, 1000);
              });
            };

            make_attempt();
          };

          args.push(tx_params, callback);
          fn.apply(self, args);
        });
      };
    }
  };

  function instantiate(instance, contract) {
    instance.contract = contract;
    var constructor = instance.constructor;

    // Provision our functions.
    for (var i = 0; i < instance.abi.length; i++) {
      var item = instance.abi[i];
      if (item.type == "function") {
        if (item.constant == true) {
          instance[item.name] = Utils.promisifyFunction(contract[item.name], constructor);
        } else {
          instance[item.name] = Utils.synchronizeFunction(contract[item.name], instance, constructor);
        }

        instance[item.name].call = Utils.promisifyFunction(contract[item.name].call, constructor);
        instance[item.name].sendTransaction = Utils.promisifyFunction(contract[item.name].sendTransaction, constructor);
        instance[item.name].request = contract[item.name].request;
        instance[item.name].estimateGas = Utils.promisifyFunction(contract[item.name].estimateGas, constructor);
      }

      if (item.type == "event") {
        instance[item.name] = contract[item.name];
      }
    }

    instance.allEvents = contract.allEvents;
    instance.address = contract.address;
    instance.transactionHash = contract.transactionHash;
  };

  // Use inheritance to create a clone of this contract,
  // and copy over contract's static functions.
  function mutate(fn) {
    var temp = function Clone() { return fn.apply(this, arguments); };

    Object.keys(fn).forEach(function(key) {
      temp[key] = fn[key];
    });

    temp.prototype = Object.create(fn.prototype);
    bootstrap(temp);
    return temp;
  };

  function bootstrap(fn) {
    fn.web3 = new Web3();
    fn.class_defaults  = fn.prototype.defaults || {};

    // Set the network iniitally to make default data available and re-use code.
    // Then remove the saved network id so the network will be auto-detected on first use.
    fn.setNetwork("default");
    fn.network_id = null;
    return fn;
  };

  // Accepts a contract object created with web3.eth.contract.
  // Optionally, if called without `new`, accepts a network_id and will
  // create a new version of the contract abstraction with that network_id set.
  function Contract() {
    if (this instanceof Contract) {
      instantiate(this, arguments[0]);
    } else {
      var C = mutate(Contract);
      var network_id = arguments.length > 0 ? arguments[0] : "default";
      C.setNetwork(network_id);
      return C;
    }
  };

  Contract.currentProvider = null;

  Contract.setProvider = function(provider) {
    var wrapped = new Provider(provider);
    this.web3.setProvider(wrapped);
    this.currentProvider = provider;
  };

  Contract.new = function() {
    if (this.currentProvider == null) {
      throw new Error("CoderForge error: Please call setProvider() first before calling new().");
    }

    var args = Array.prototype.slice.call(arguments);

    if (!this.unlinked_binary) {
      throw new Error("CoderForge error: contract binary not set. Can't deploy new instance.");
    }

    var regex = /__[^_]+_+/g;
    var unlinked_libraries = this.binary.match(regex);

    if (unlinked_libraries != null) {
      unlinked_libraries = unlinked_libraries.map(function(name) {
        // Remove underscores
        return name.replace(/_/g, "");
      }).sort().filter(function(name, index, arr) {
        // Remove duplicates
        if (index + 1 >= arr.length) {
          return true;
        }

        return name != arr[index + 1];
      }).join(", ");

      throw new Error("CoderForge contains unresolved libraries. You must deploy and link the following libraries before you can deploy a new version of CoderForge: " + unlinked_libraries);
    }

    var self = this;

    return new Promise(function(accept, reject) {
      var contract_class = self.web3.eth.contract(self.abi);
      var tx_params = {};
      var last_arg = args[args.length - 1];

      // It's only tx_params if it's an object and not a BigNumber.
      if (Utils.is_object(last_arg) && !Utils.is_big_number(last_arg)) {
        tx_params = args.pop();
      }

      tx_params = Utils.merge(self.class_defaults, tx_params);

      if (tx_params.data == null) {
        tx_params.data = self.binary;
      }

      // web3 0.9.0 and above calls new twice this callback twice.
      // Why, I have no idea...
      var intermediary = function(err, web3_instance) {
        if (err != null) {
          reject(err);
          return;
        }

        if (err == null && web3_instance != null && web3_instance.address != null) {
          accept(new self(web3_instance));
        }
      };

      args.push(tx_params, intermediary);
      contract_class.new.apply(contract_class, args);
    });
  };

  Contract.at = function(address) {
    if (address == null || typeof address != "string" || address.length != 42) {
      throw new Error("Invalid address passed to CoderForge.at(): " + address);
    }

    var contract_class = this.web3.eth.contract(this.abi);
    var contract = contract_class.at(address);

    return new this(contract);
  };

  Contract.deployed = function() {
    if (!this.address) {
      throw new Error("Cannot find deployed address: CoderForge not deployed or address not set.");
    }

    return this.at(this.address);
  };

  Contract.defaults = function(class_defaults) {
    if (this.class_defaults == null) {
      this.class_defaults = {};
    }

    if (class_defaults == null) {
      class_defaults = {};
    }

    var self = this;
    Object.keys(class_defaults).forEach(function(key) {
      var value = class_defaults[key];
      self.class_defaults[key] = value;
    });

    return this.class_defaults;
  };

  Contract.extend = function() {
    var args = Array.prototype.slice.call(arguments);

    for (var i = 0; i < arguments.length; i++) {
      var object = arguments[i];
      var keys = Object.keys(object);
      for (var j = 0; j < keys.length; j++) {
        var key = keys[j];
        var value = object[key];
        this.prototype[key] = value;
      }
    }
  };

  Contract.all_networks = {
  "default": {
    "abi": [
      {
        "constant": false,
        "inputs": [
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "nameUrl",
            "type": "string"
          },
          {
            "name": "host",
            "type": "string"
          },
          {
            "name": "hostUrl",
            "type": "string"
          },
          {
            "name": "meetup",
            "type": "string"
          }
        ],
        "name": "newForge",
        "outputs": [
          {
            "name": "",
            "type": "address"
          }
        ],
        "type": "function"
      },
      {
        "inputs": [],
        "type": "constructor"
      }
    ],
    "unlinked_binary": "0x606060405260008054600160a060020a03191633179055610fdf806100246000396000f3606060405260e060020a600035046345739385811461001b575b005b61018e6004808035906020019082018035906020019191908080601f01602080910402602001604051908101604052809392919081815260200183838082843750506040805160208835808b0135601f8101839004830284018301909452838352979998604498929750919091019450909250829150840183828082843750506040805160209735808a0135601f81018a90048a0283018a019093528282529698976064979196506024919091019450909250829150840183828082843750506040805160209735808a0135601f81018a90048a0283018a019093528282529698976084979196506024919091019450909250829150840183828082843750506040805160209735808a0135601f81018a90048a0283018a0190935282825296989760a49791965060249190910194509092508291508401838280828437509496505050505050506000805481903373ffffffffffffffffffffffffffffffffffffffff9081169116146101b8576103b8565b6040805173ffffffffffffffffffffffffffffffffffffffff929092168252519081900360200190f35b8686868686604051610c1d806103c283390180806020018060200180602001806020018060200186810386528b8181518152602001915080519060200190808383829060006004602084601f0104600302600f01f150905090810190601f1680156102375780820380516001836020036101000a031916815260200191505b5086810385528a8181518152602001915080519060200190808383829060006004602084601f0104600302600f01f150905090810190601f1680156102905780820380516001836020036101000a031916815260200191505b508681038452898181518152602001915080519060200190808383829060006004602084601f0104600302600f01f150905090810190601f1680156102e95780820380516001836020036101000a031916815260200191505b508681038352888181518152602001915080519060200190808383829060006004602084601f0104600302600f01f150905090810190601f1680156103425780820380516001836020036101000a031916815260200191505b508681038252878181518152602001915080519060200190808383829060006004602084601f0104600302600f01f150905090810190601f16801561039b5780820380516001836020036101000a031916815260200191505b509a5050505050505050505050604051809103906000f090508091505b5095945050505050566060604052604051610c1d380380610c1d83398101604052805160805160a05160c05160e0519385019492830193918301929081019101604080517f6e616d65000000000000000000000000000000000000000000000000000000008152600060048201819052915190819003602401902086518154828452602093849020929360026001831615610100026000190190921691909104601f908101829004840193918a01908390106100d557805160ff19168380011785555b506101059291505b808211156101a057600081556001016100c1565b828001600101855582156100b9579182015b828111156100b95782518260005055916020019190600101906100e7565b505083600060005060405180807f6e616d6555726c00000000000000000000000000000000000000000000000000815260200150600701905090815260200160405180910390206000509080519060200190828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106101a457805160ff19168380011785555b506101d49291506100c1565b5090565b82800160010185558215610194579182015b828111156101945782518260005055916020019190600101906101b6565b5050604080517f686f7374000000000000000000000000000000000000000000000000000000008152600060048201819052915190819003602401902084518154828452602093849020929360026001831615610100026000190190921691909104601f9081018290048401939188019083901061026557805160ff19168380011785555b506102959291506100c1565b82800160010185558215610259579182015b82811115610259578251826000505591602001919060010190610277565b505081600060005060405180807f686f737455726c00000000000000000000000000000000000000000000000000815260200150600701905090815260200160405180910390206000509080519060200190828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061033057805160ff19168380011785555b506103609291506100c1565b82800160010185558215610324579182015b82811115610324578251826000505591602001919060010190610342565b5050604080517f6d656574757000000000000000000000000000000000000000000000000000008152600060068201819052915190819003602601902082518154828452602093849020929360026001831615610100026000190190921691909104601f908101829004840193918601908390106103f157805160ff19168380011785555b506104219291506100c1565b828001600101855582156103e5579182015b828111156103e5578251826000505591602001919060010190610403565b505050505050506107e7806104366000396000f3606060405260e060020a60003504634ba4ca378114610026578063ca60249214610129575b005b6040805160206004803580820135601f81018490048402850184019095528484526102d79491936024939092918401919081908401838280828437509496505050505050506020604051908101604052806000815260200150600060005082604051808280519060200190808383829060006004602084601f0104600302600f01f15090500191505090815260200160405180910390206000508054600181600116156101000203166002900480601f01602080910402602001604051908101604052809291908181526020018280546001816001161561010002031660029004801561055a5780601f1061052f5761010080835404028352916020019161055a565b610345604080516020818101835260008083528351808301855281815284518084018652828152855180850187528381528651808601885284815287517f6e616d650000000000000000000000000000000000000000000000000000000081526004818101879052895191829003602490810183207f6e616d6555726c00000000000000000000000000000000000000000000000000845260078481018a90528c5194859003602790810186207f686f73740000000000000000000000000000000000000000000000000000000087529486018b90528d519586900390930185207f686f737455726c0000000000000000000000000000000000000000000000000086529085018a90528c519485900390920184207f6d65657475700000000000000000000000000000000000000000000000000000855260068501999099528b51938490036026018420815460026001821615610100026000190190911604601f81018c90048c0286018c01909d528c85529a9b979a96999598949790969295919493918791908301828280156105d45780601f106105a9576101008083540402835291602001916105d4565b60405180806020018281038252838181518152602001915080519060200190808383829060006004602084601f0104600302600f01f150905090810190601f1680156103375780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b60405180806020018060200180602001806020018060200186810386528b8181518152602001915080519060200190808383829060006004602084601f0104600302600f01f150905090810190601f1680156103b55780820380516001836020036101000a031916815260200191505b5086810385528a8181518152602001915080519060200190808383829060006004602084601f0104600302600f01f150905090810190601f16801561040e5780820380516001836020036101000a031916815260200191505b508681038452898181518152602001915080519060200190808383829060006004602084601f0104600302600f01f150905090810190601f1680156104675780820380516001836020036101000a031916815260200191505b508681038352888181518152602001915080519060200190808383829060006004602084601f0104600302600f01f150905090810190601f1680156104c05780820380516001836020036101000a031916815260200191505b508681038252878181518152602001915080519060200190808383829060006004602084601f0104600302600f01f150905090810190601f1680156105195780820380516001836020036101000a031916815260200191505b509a505050505050505050505060405180910390f35b820191906000526020600020905b81548152906001019060200180831161053d57829003601f168201915b50505050509050919050565b820191906000526020600020905b81548152906001019060200180831161057457829003601f168201915b50505050509050945094509450945094509091929394565b820191906000526020600020905b8154815290600101906020018083116105b757829003601f168201915b5050875460408051602060026001851615610100026000190190941693909304601f8101849004840282018401909252818152959a50899450925084019050828280156106625780601f1061063757610100808354040283529160200191610662565b820191906000526020600020905b81548152906001019060200180831161064557829003601f168201915b5050604080518854602060026001831615610100026000190190921691909104601f81018290048202830182019093528282529599509488945090925084019050828280156106f25780601f106106c7576101008083540402835291602001916106f2565b820191906000526020600020905b8154815290600101906020018083116106d557829003601f168201915b5050604080518754602060026001831615610100026000190190921691909104601f81018290048202830182019093528282529598509487945090925084019050828280156107825780601f1061075757610100808354040283529160200191610782565b820191906000526020600020905b81548152906001019060200180831161076557829003601f168201915b5050604080518654602060026001831615610100026000190190921691909104601f81018290048202830182019093528282529597509486945090925084019050828280156105915780601f106105665761010080835404028352916020019161059156",
    "events": {},
    "updated_at": 1473965554629,
    "links": {},
    "address": "0x2d6f010b4e4f8ebdde44a3e208ea9e95ee72c73b"
  }
};

  Contract.checkNetwork = function(callback) {
    var self = this;

    if (this.network_id != null) {
      return callback();
    }

    this.web3.version.network(function(err, result) {
      if (err) return callback(err);

      var network_id = result.toString();

      // If we have the main network,
      if (network_id == "1") {
        var possible_ids = ["1", "live", "default"];

        for (var i = 0; i < possible_ids.length; i++) {
          var id = possible_ids[i];
          if (Contract.all_networks[id] != null) {
            network_id = id;
            break;
          }
        }
      }

      if (self.all_networks[network_id] == null) {
        return callback(new Error(self.name + " error: Can't find artifacts for network id '" + network_id + "'"));
      }

      self.setNetwork(network_id);
      callback();
    })
  };

  Contract.setNetwork = function(network_id) {
    var network = this.all_networks[network_id] || {};

    this.abi             = this.prototype.abi             = network.abi;
    this.unlinked_binary = this.prototype.unlinked_binary = network.unlinked_binary;
    this.address         = this.prototype.address         = network.address;
    this.updated_at      = this.prototype.updated_at      = network.updated_at;
    this.links           = this.prototype.links           = network.links || {};
    this.events          = this.prototype.events          = network.events || {};

    this.network_id = network_id;
  };

  Contract.networks = function() {
    return Object.keys(this.all_networks);
  };

  Contract.link = function(name, address) {
    if (typeof name == "function") {
      var contract = name;

      if (contract.address == null) {
        throw new Error("Cannot link contract without an address.");
      }

      Contract.link(contract.contract_name, contract.address);

      // Merge events so this contract knows about library's events
      Object.keys(contract.events).forEach(function(topic) {
        Contract.events[topic] = contract.events[topic];
      });

      return;
    }

    if (typeof name == "object") {
      var obj = name;
      Object.keys(obj).forEach(function(name) {
        var a = obj[name];
        Contract.link(name, a);
      });
      return;
    }

    Contract.links[name] = address;
  };

  Contract.contract_name   = Contract.prototype.contract_name   = "CoderForge";
  Contract.generated_with  = Contract.prototype.generated_with  = "3.2.0";

  // Allow people to opt-in to breaking changes now.
  Contract.next_gen = false;

  var properties = {
    binary: function() {
      var binary = Contract.unlinked_binary;

      Object.keys(Contract.links).forEach(function(library_name) {
        var library_address = Contract.links[library_name];
        var regex = new RegExp("__" + library_name + "_*", "g");

        binary = binary.replace(regex, library_address.replace("0x", ""));
      });

      return binary;
    }
  };

  Object.keys(properties).forEach(function(key) {
    var getter = properties[key];

    var definition = {};
    definition.enumerable = true;
    definition.configurable = false;
    definition.get = getter;

    Object.defineProperty(Contract, key, definition);
    Object.defineProperty(Contract.prototype, key, definition);
  });

  bootstrap(Contract);

  if (typeof module != "undefined" && typeof module.exports != "undefined") {
    module.exports = Contract;
  } else {
    // There will only be one version of this contract in the browser,
    // and we can use that.
    window.CoderForge = Contract;
  }
})();
