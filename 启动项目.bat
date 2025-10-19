@echo off
chcp 65001 >nul
echo ========================================
echo    Vue3 H5 项目启动脚本
echo ========================================
echo.

:: 检查 node_modules 是否存在
if not exist "node_modules\" (
    echo [提示] 检测到未安装依赖，正在安装...
    echo.
    call npm install
    echo.
    if errorlevel 1 (
        echo [错误] 依赖安装失败，请检查网络或 Node.js 环境
        pause
        exit /b 1
    )
    echo [成功] 依赖安装完成！
    echo.
)

echo [启动] 正在启动开发服务器...
echo.
echo ----------------------------------------
echo  项目将在浏览器自动打开
echo  本地访问: http://localhost:3000
echo  
echo  手机访问: 查看下方的 Network 地址
echo  (确保手机和电脑在同一WiFi)
echo ----------------------------------------
echo.

call npm run dev

