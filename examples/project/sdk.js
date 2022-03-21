export class NearContract {
    deserialize() {
        let hasRead = env.jsvm_storage_read('STATE', 0)
        if (hasRead != 0)
            Object.assign(this, JSON.parse(env.read_register(0)))
        else
            throw new Error('Contract state is empty')
    }

    serialize() {
        env.jsvm_storage_write('STATE', JSON.stringify(this), 0)
    }
}

export function call (target, name, descriptor) {
    let oldMethod = descriptor.value
    descriptor.value = function(...args) {
        let ret = oldMethod.apply(target, args)
        target.serialize()
        return ret
    }
    return descriptor
}

export function view (target, name, descriptor) {
    let oldMethod = descriptor.value
    descriptor.value = function(...args) {
        return oldMethod.apply(target, args)
    }
    return descriptor
}

export function NearBindgen (Class) {
    let OriginalClass = Class
    let NewClass = function(...args) {
        let ret = new OriginalClass(...args)
        ret.serialize()
        return ret
    }
    NewClass.prototype = OriginalClass.prototype
    NewClass._get = function() {
        let ret = new OriginalClass()
        ret.deserialize()
        return ret
    }

    return NewClass
}
