#!/bin/bash

# オペランドチェック
if [ $# -eq 0 ]; then
  echo "エラー: 対象ファイルを指定してください" >&2
  echo "使い方: bash remove_comments.sh <file1> [file2] ..." >&2
  exit 1
fi

for file in "$@"; do

  # ファイルの存在チェック
  if [ ! -f "$file" ]; then
    echo "警告: $file が見つかりません。スキップします" >&2
    continue
  fi

  # [KEEP] を含まないコメント行を削除
  sed -i '/^[[:space:]]*\/\//{/\[KEEP\]/!d;}' "$file"
  echo "処理完了: $file"

done

echo "=== 削除後の差分 ==="
git diff