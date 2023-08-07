#![deny(clippy::all)]
use std::borrow::Cow;
use napi::bindgen_prelude::Buffer;
use sha2::{Digest, Sha256, Sha512};

#[macro_use]
extern crate napi_derive;

#[napi]
pub fn sha512(input: String) -> String {
  let mut hasher = Sha512::new();
  hasher.update(input);
  let result = hasher.finalize();
  format!("{:x}", result)
}

// TODO: REMOVE
#[napi]
pub fn sha512_buf(buf: Buffer) -> String {
  let mut hasher = Sha512::new();
  let input: Cow<'_, str> = String::from_utf8_lossy(&buf);

  hasher.update(input.into_owned());
  let result = hasher.finalize();
  format!("{:x}", result)
}

#[napi]
pub fn sha256(input: String) -> String {
  let mut hasher = Sha256::new();
  hasher.update(input);
  let result = hasher.finalize();
  format!("{:x}", result)
}

// TODO: REMOVE
#[napi]
pub fn sha256_buf(buf: Buffer) -> String {
  let mut hasher = Sha256::new();
  let input: Cow<'_, str> = String::from_utf8_lossy(&buf);

  hasher.update(input.into_owned());
  let result = hasher.finalize();
  format!("{:x}", result)
}
