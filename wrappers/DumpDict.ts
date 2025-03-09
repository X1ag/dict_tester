import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode, Slice } from '@ton/core';

export type DumpDictConfig = {};

export function dumpDictConfigToCell(config: DumpDictConfig): Cell {
    return beginCell().endCell();
}


export class DumpDict implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new DumpDict(address);
    }

    static createFromConfig(config: DumpDictConfig, code: Cell, workchain = 0) {
        const data = dumpDictConfigToCell(config);
        const init = { code, data };
        return new DumpDict(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }

    async getValueByAddress(provider: ContractProvider, key: bigint) {
        const result = (await provider.get('get_value_from_dict', [{ type: 'int', value: key }])).stack;
        return result;
    }

}
