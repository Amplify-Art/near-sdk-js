import * as near from "./api";
import { deserialize, serialize } from "./utils";
// type DecoratorFunction = (
//   target: AnyObject,
//   key: string | symbol,
//   descriptor: TypedPropertyDescriptor<Function>
// ) => void;
export function initialize(_empty) {
    /* eslint-disable @typescript-eslint/no-empty-function */
    return function (_target, _key, _descriptor) { };
    /* eslint-enable @typescript-eslint/no-empty-function */
}
export function call({ privateFunction = false, payableFunction = false, }) {
    return function (_target, _key, descriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = function (...args) {
            if (privateFunction &&
                near.predecessorAccountId() !== near.currentAccountId()) {
                throw Error("Function is private");
            }
            if (!payableFunction && near.attachedDeposit() > BigInt(0)) {
                throw Error("Function is not payable");
            }
            return originalMethod.apply(this, args);
        };
    };
}
export function view(_empty) {
    /* eslint-disable @typescript-eslint/no-empty-function */
    return function (_target, _key, _descriptor) { };
    /* eslint-enable @typescript-eslint/no-empty-function */
}
export function NearBindgen({ requireInit = false, }) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (target) => {
        return class extends target {
            static _create() {
                return new target();
            }
            static _getState() {
                const rawState = near.storageRead("STATE");
                return rawState ? this._deserialize(rawState) : null;
            }
            static _saveToStorage(objectToSave) {
                near.storageWrite("STATE", this._serialize(objectToSave));
            }
            static _getArgs() {
                return JSON.parse(near.input() || "{}");
            }
            static _serialize(value, forReturn = false) {
                if (forReturn) {
                    return JSON.stringify(value, (_, value) => typeof value === "bigint" ? `${value}` : value);
                }
                return serialize(value);
            }
            static _deserialize(value) {
                return deserialize(value);
            }
            static _reconstruct(classObject, plainObject) {
                for (const item in classObject) {
                    const reconstructor = classObject[item].constructor?.reconstruct;
                    classObject[item] = reconstructor
                        ? reconstructor(plainObject[item])
                        : plainObject[item];
                }
                return classObject;
            }
            static _requireInit() {
                return requireInit;
            }
        };
    };
}
