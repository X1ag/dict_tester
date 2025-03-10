import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { address, beginCell, Cell, toNano } from '@ton/core';
import { DumpDict } from '../wrappers/DumpDict';
import '@ton/test-utils';
import { compile } from '@ton/blueprint';

describe('DumpDict', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('DumpDict');
    });

    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let dumpDict: SandboxContract<DumpDict>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        dumpDict = blockchain.openContract(
            DumpDict.createFromConfig(
                {
                    id: 0,
                    counter: 0,
                },
                code
            )
        );

        deployer = await blockchain.treasury('deployer');

        const deployResult = await dumpDict.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: dumpDict.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and dumpDict are ready to use
    });

    it("should add to dict", async () => {
        const result = await dumpDict.sendTxAddToDict(deployer.getSender(), toNano('1'))

        expect(result.transactions).toHaveTransaction({
            from: deployer.address,
            to: dumpDict.address,
            success: true
        })
        const address_cell = beginCell().storeAddress(deployer.address).endCell();
        const value = await dumpDict.getValueByAddress(address_cell)
        console.log(value)
        expect(value).toBeGreaterThanOrEqual(toNano('0.9'))

        const result2 = await dumpDict.sendTxAddToDict(deployer.getSender(), toNano('1'))

        expect(result2.transactions).toHaveTransaction({
            from: deployer.address,
            to:dumpDict.address,
            success: true
        })

        const value2 = await dumpDict.getValueByAddress(address_cell)
        console.log(value2)
        expect(value2).toBeGreaterThanOrEqual(toNano('1.9'))
    });

});
