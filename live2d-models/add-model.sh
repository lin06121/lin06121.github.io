#!/usr/bin/env bash
# ============================================================
# add-model.sh — Yulin's Jungle Live2D 模型一键添加脚本
#
# 用法 (在本目录或项目根运行):
#   1. 自动扫描所有未配置的新模型并添加:
#        bash source/live2d-models/add-model.sh
#   2. 指定添加某个模型文件夹:
#        bash source/live2d-models/add-model.sh 模型文件夹名
#   3. 指定模型 + 自定义缩放比例(默认 0.08):
#        bash source/live2d-models/add-model.sh 模型文件夹名 0.1
#
# 注意: 运行前请先停止 hexo server, 否则可能被锁文件
#   停止: taskkill //F //IM node.exe
# ============================================================
set -euo pipefail

# 定位目录(脚本位于 source/live2d-models/)
MODELS_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(cd "$MODELS_DIR/../.." && pwd)"
CONFIG="$PROJECT_ROOT/_config.yml"

SCALE="${2:-0.08}"

# ---- 找到模型入口文件 (.model3.json 优先, 兼容 .moc3 / .moc) ----
find_entry() {
  local name="$1"
  if [ -f "$MODELS_DIR/$name/$name.model3.json" ]; then
    echo "$name/$name.model3.json"
  elif [ -f "$MODELS_DIR/$name/model.json" ]; then
    echo "$name/model.json"
  elif [ -f "$MODELS_DIR/$name/$name.model.json" ]; then
    echo "$name/$name.model.json"
  else
    echo ""
  fi
}

# ---- 将模型配置块插入 _config.yml 的 models 列表 (primaryColor 前) ----
add_model() {
  local name="$1"
  local entry="$2"

  if grep -qF -- "/$entry" "$CONFIG"; then
    echo "[跳过] $name 已在 _config.yml 中配置"
    return 0
  fi

  # 检查插入锚点是否存在
  if ! grep -q "^    primaryColor:" "$CONFIG"; then
    echo "[错误] _config.yml 中找不到 'primaryColor' 锚点, 请手动添加"
    return 1
  fi

  local block
  block="      - path: /live2d-models/$entry
        scale: $SCALE
        position: [-60, -50]
        stageStyle:
          width: 360
          height: 360
        mobileScale: 0.08
        mobilePosition: [-10, 23]
        mobileStageStyle:
          width: 200
          height: 200"

  awk -v b="$block" '
    /^    primaryColor:/ { print b }
    { print }
  ' "$CONFIG" > "$CONFIG.tmp" && mv "$CONFIG.tmp" "$CONFIG"

  echo "[已添加] $name → /live2d-models/$entry (scale=$SCALE)"
}

# ---- 主逻辑 ----
if [ $# -ge 1 ]; then
  name="$1"
  entry="$(find_entry "$name")"
  if [ -z "$entry" ]; then
    echo "[错误] 在 $MODELS_DIR/$name 找不到模型入口文件"
    echo "       需要 ${name}.model3.json 或 model.json"
    exit 1
  fi
  add_model "$name" "$entry"
else
  echo "正在扫描 $MODELS_DIR 下的模型..."
  found=0
  for dir in "$MODELS_DIR"/*/; do
    [ -d "$dir" ] || continue
    name="$(basename "$dir")"
    # 跳过脚本自身所在目录的无关文件
    [ "$name" = "add-model" ] && continue
    entry="$(find_entry "$name")"
    if [ -z "$entry" ]; then
      echo "[警告] $name 缺少入口文件, 跳过"
      continue
    fi
    if grep -qF -- "/$entry" "$CONFIG"; then
      continue
    fi
    add_model "$name" "$entry"
    found=1
  done
  if [ "$found" -eq 0 ]; then
    echo "没有发现未配置的新模型。"
  fi
fi

echo ""
echo "完成! 请运行: hexo clean && hexo generate && hexo deploy"
