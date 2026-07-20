# Web GUI Tester

```powershell
# 1. 装依赖
pip install playwright pyyaml
playwright install chrome

# 2. 设置登录凭据（变量名根据你的测试用例定义）
$env:LOGIN_USER = "your_username"
$env:LOGIN_PASS = "your_password"

# 3. 运行测试
python run.py tests/your_test.yaml

# 4. 创建你自己的测试，参考 tests/github_login.yaml 修改
```