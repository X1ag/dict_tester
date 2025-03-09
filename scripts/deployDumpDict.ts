import { toNano } from '@ton/core';
import { DumpDict } from '../wrappers/DumpDict';
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const dumpDict = provider.open(
        DumpDict.createFromConfig(
            {
                id: Math.floor(Math.random() * 10000),
                counter: 0,
            },
            await compile('DumpDict')
        )
    );

    await dumpDict.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(dumpDict.address);

    console.log('ID', await dumpDict.getID());
}
