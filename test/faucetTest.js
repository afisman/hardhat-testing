const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { expect } = require('chai');

describe('Faucet', function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployContractAndSetVariables() {
    const Faucet = await ethers.getContractFactory('Faucet');
    const faucet = await Faucet.deploy();

    const [owner, address2] = await ethers.getSigners();

    let withdrawAmount = ethers.utils.parseUnits("1", "ether");

    return { faucet, owner, withdrawAmount, address2 };
  }

  it('should deploy and set the owner correctly', async function () {
    const { faucet, owner } = await loadFixture(deployContractAndSetVariables);

    expect(await faucet.owner()).to.equal(owner.address);
  });

  it('should reject if withdraw more than 0.1 ETH', async function () {
    const { faucet, withdrawAmount } = await loadFixture(deployContractAndSetVariables);

    await expect(faucet.withdraw(withdrawAmount)).to.be.reverted;
  });

  it('only owner can withdraw all', async function () {
    const { faucet, address2 } = await loadFixture(deployContractAndSetVariables);

    await expect(faucet.connect(address2).withdrawAll()).to.be.reverted;
  });

  it('only owner can destroy faucet', async function () {
    const { faucet, address2 } = await loadFixture(deployContractAndSetVariables);

    await expect(faucet.connect(address2).destroyFaucet()).to.be.reverted;
  });


});
