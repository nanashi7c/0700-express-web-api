#!/bin/bash

if [ $# -eq 0 ]; then 
# 引数なしの場合: HEAD のコミットで変更された .ts ファイルを自動対象にする
mapfile -t auto_files < <(git diff-tree --no-commit-id --name-only -r HEAD | grep -E '\.ts$' || true)
  if [ ${#auto_files[@]} -eq 0 ]; then
    echo "対象 .ts ファイルなし（HEAD のコミットに .ts 変更なし）"
    exit 0
  fi
  echo "対象ファイル（HEAD のコミットより自動検出）:"
  printf '  - %s\n' "${auto_files[@]}"
  set -- "${auto_files[@]}"
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