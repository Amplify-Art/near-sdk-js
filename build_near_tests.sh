#!/bin/bash
make qjsc
./qjsc examples/near_tests.js -c -o code.h -N code

cat <<EOF > methods.h
DEFINE_NEAR_METHOD(test_register)
DEFINE_NEAR_METHOD(test_current_account_id)
DEFINE_NEAR_METHOD(test_signer_account_id)
DEFINE_NEAR_METHOD(test_signer_account_pk)
DEFINE_NEAR_METHOD(test_predecessor_account_id)
DEFINE_NEAR_METHOD(test_input)
DEFINE_NEAR_METHOD(test_block_index)
DEFINE_NEAR_METHOD(test_block_timestamp)
DEFINE_NEAR_METHOD(test_epoch_height)
DEFINE_NEAR_METHOD(test_storage_usage)
DEFINE_NEAR_METHOD(test_account_balance)
DEFINE_NEAR_METHOD(test_account_locked_balance)
DEFINE_NEAR_METHOD(test_attached_deposit)
DEFINE_NEAR_METHOD(test_prepaid_gas)
DEFINE_NEAR_METHOD(test_used_gas)
DEFINE_NEAR_METHOD(test_sha256)
DEFINE_NEAR_METHOD(test_keccak256)
DEFINE_NEAR_METHOD(test_keccak512)
DEFINE_NEAR_METHOD(test_ripemd160)
DEFINE_NEAR_METHOD(test_ecrecover)
DEFINE_NEAR_METHOD(test_log)
DEFINE_NEAR_METHOD(test_promise_create)
DEFINE_NEAR_METHOD(test_promise_then)
DEFINE_NEAR_METHOD(test_promise_and)
DEFINE_NEAR_METHOD(test_promise_batch_create)
DEFINE_NEAR_METHOD(test_promise_batch_then)

EOF

defs='-D_GNU_SOURCE -DCONFIG_VERSION="2021-03-27" -DCONFIG_BIGNUM'
sources='builder.c quickjs.c libregexp.c libunicode.c cutils.c quickjs-libc-min.c libbf.c'
libs='-lm'
includes="-Istubs"

# clang --target=wasm32 \
clang --target=wasm32-unknown-wasi \
    --sysroot $HOME/Downloads/pkg/wasi-libc \
    -nostartfiles -Oz \
    ${defs} ${includes} ${sources} ${libs} \
    -Wl,--no-entry \
    -Wl,--export-all \
    -Wl,--allow-undefined \
    -Wl,-z,stack-size=$[256 * 1024] \
    -o near_tests.wasm