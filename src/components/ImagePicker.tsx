"use client";

import { useRef, useState } from "react";
import type { DragEvent } from "react";
import { toFaDigits } from "@/lib/tehran";
import { MAX_UPLOAD_BYTES, MAX_UPLOAD_MB, faBytes } from "@/lib/upload-limits";
import { ImagesIcon } from "./Icons";

const ACCEPT = "image/jpeg,image/png,image/webp";
const OK_TYPE = /^image\/(jpeg|png|webp)$/;

type Props = {
  /** big line, e.g. «افزودن تصویر به نوزاد» */
  title: string;
  multiple?: boolean;
  /** when set, the picker is locked and shows this progress text */
  busy?: string;
  /** called with files that passed the type/size check */
  onFiles: (files: File[]) => void;
  /** optional: also receive the rejection message (it is always shown inside the picker) */
  onReject?: (message: string) => void;
  compact?: boolean;
};

/**
 * The one way to pick photos in the admin panel:
 * a clear «انتخاب فایل» (browse) button + drag & drop, with the size limit
 * always visible. Files that are too big or the wrong type are rejected
 * up front with their names, before any upload starts.
 */
export function ImagePicker({ title, multiple = false, busy, onFiles, onReject, compact = false }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);
  const [rejected, setRejected] = useState("");
  const locked = Boolean(busy);

  function handle(list: FileList | null) {
    if (!list?.length || locked) return;
    const files = Array.from(list).slice(0, multiple ? 50 : 1);
    const ok: File[] = [];
    const tooBig: string[] = [];
    const badType: string[] = [];
    for (const f of files) {
      if (/\.hei[cf]$/i.test(f.name) || /heic|heif/i.test(f.type)) badType.push(`${f.name} (HEIC آیفون)`);
      else if (!OK_TYPE.test(f.type)) badType.push(f.name);
      else if (f.size > MAX_UPLOAD_BYTES) tooBig.push(`${f.name} (${faBytes(f.size)})`);
      else ok.push(f);
    }
    const msgs: string[] = [];
    if (tooBig.length) msgs.push(`بیشتر از ${toFaDigits(MAX_UPLOAD_MB)} مگابایت: ${tooBig.join("، ")}`);
    if (badType.length) msgs.push(`فقط JPG، PNG یا WebP پذیرفته می‌شود: ${badType.join("، ")}`);
    setRejected(msgs.join(" — "));
    if (ok.length) onFiles(ok);
    if (msgs.length) onReject?.(msgs.join(" — "));
    if (inputRef.current) inputRef.current.value = "";
  }

  function onDrop(e: DragEvent) {
    e.preventDefault();
    setOver(false);
    handle(e.dataTransfer.files);
  }

  return (
    <div
      className={`img-picker${over ? " is-over" : ""}${locked ? " is-busy" : ""}${compact ? " is-compact" : ""}`}
      onDragOver={(e) => {
        e.preventDefault();
        if (!locked) setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={onDrop}
    >
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        multiple={multiple}
        disabled={locked}
        hidden
        onChange={(e) => handle(e.target.files)}
      />

      <span className="img-picker__icon" aria-hidden="true">
        {locked ? <span className="img-picker__spinner" /> : <ImagesIcon size={26} />}
      </span>

      <strong className="img-picker__title">{busy || title}</strong>

      {!locked ? (
        <>
          <button
            type="button"
            className="admin-btn img-picker__browse"
            onClick={() => inputRef.current?.click()}
          >
            {multiple ? "انتخاب فایل‌ها از دستگاه (Browse)" : "انتخاب فایل از دستگاه (Browse)"}
          </button>
          <span className="img-picker__or">یا عکس را اینجا بکشید و رها کنید</span>
        </>
      ) : null}

      {rejected ? (
        <p className="img-picker__rejected" role="alert">
          ⚠ {rejected}
        </p>
      ) : null}

      <span className="img-picker__limit">
        JPG، PNG یا WebP · حداکثر <b>{toFaDigits(MAX_UPLOAD_MB)} مگابایت</b> برای هر عکس
        {multiple ? " · چند عکس را با هم انتخاب کنید" : ""} · خودکار سبک و فشرده می‌شود
      </span>
    </div>
  );
}
