@echo off
start "搜索服务" cmd /k "node search-service.js"
start "天气服务" cmd /k "node weather-service.js"
start "7天天气服务" cmd /k "node daily-service.js"


echo 服务已启动，按任意键退出...
pause >nul