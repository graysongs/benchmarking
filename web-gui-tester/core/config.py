"""
配置加载模块 — 读取 YAML 配置文件
"""
import os
import yaml
from pathlib import Path


DEFAULT_CONFIG_PATH = Path(__file__).resolve().parent.parent / "config.yaml"


def load_config(path: str | Path | None = None) -> dict:
    """加载 YAML 配置文件，与默认配置合并"""
    path = Path(path) if path else DEFAULT_CONFIG_PATH

    if not path.exists():
        raise FileNotFoundError(f"配置文件不存在: {path}")

    with open(path, encoding="utf-8") as f:
        config = yaml.safe_load(f)

    # 确保关键字段存在
    _apply_defaults(config)
    return config


def _apply_defaults(config: dict):
    """对缺失的配置项填充默认值"""
    defaults = {
        "browser": {
            "type": "chromium",
            "headless": False,
            "viewport": {"width": 1280, "height": 720},
            "launch_args": [],
        },
        "timeout": {
            "element": 10000,
            "page_load": 30000,
            "navigation": 30000,
        },
        "screenshot": {
            "auto_capture": True,
            "output_dir": "reports/screenshots",
        },
    }
    for section, values in defaults.items():
        if section not in config:
            config[section] = {}
        for key, val in values.items():
            config[section].setdefault(key, val)

    # 确保截图输出目录存在
    screenshot_dir = Path(config["screenshot"]["output_dir"])
    screenshot_dir.mkdir(parents=True, exist_ok=True)
