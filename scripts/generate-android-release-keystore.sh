#!/usr/bin/env bash

set -euo pipefail
umask 077

project_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
secrets_dir="${project_root}/.secrets/android"
keystore_file="${secrets_dir}/panora-release.keystore"
properties_file="${secrets_dir}/keystore.properties"

if [[ -e "${keystore_file}" || -e "${properties_file}" ]]; then
  echo "Release signing files already exist; refusing to overwrite them." >&2
  exit 1
fi

mkdir -p "${secrets_dir}"
store_password="$(openssl rand -base64 36 | tr -d '\n')"
key_password="${store_password}"
key_alias="panora-release"

keytool -genkeypair \
  -v \
  -storetype PKCS12 \
  -keystore "${keystore_file}" \
  -storepass "${store_password}" \
  -alias "${key_alias}" \
  -keypass "${key_password}" \
  -keyalg RSA \
  -keysize 4096 \
  -validity 10000 \
  -dname "CN=Panora, OU=Mobile, O=Panora, L=Kolkata, ST=West Bengal, C=IN"

{
  printf 'storeFile=panora-release.keystore\n'
  printf 'storePassword=%s\n' "${store_password}"
  printf 'keyAlias=%s\n' "${key_alias}"
  printf 'keyPassword=%s\n' "${key_password}"
} >"${properties_file}"

chmod 600 "${keystore_file}" "${properties_file}"
echo "Created ${keystore_file}"
echo "Created ${properties_file}"
