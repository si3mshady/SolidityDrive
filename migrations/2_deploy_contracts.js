const SolidityDrive = artifacts.require('SolidityDrive.sol')

module.exports = function(_deployer) {
  // Use deployer to state migration tasks.
  _deployer.deploy(SolidityDrive)
};
