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

    async sendTxAddToDict(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().storeUint(0x0001, 32).storeUint(123n,64).endCell(),
        });
    }
    async sendTxDeleteFromDict(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().storeUint(0x0002, 32).storeUint(123n,64).endCell(),
        });
    }

    async getValueByAddress(provider: ContractProvider, key: Cell) {
        const result = (await provider.get('get_value_from_dict', [{ type: 'cell', cell: key }])).stack;
        return result.readBigNumber();
    }
}
