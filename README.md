# ![Version](https://img.shields.io/badge/version-0.0.6-green.svg)

## 结构
* dist - 编译后的目录(js)
* node_modules - npm包目录
* src - 源代码
  * api - api相关
  * dp - 设计模式
    * cor - 责任链
  * io - io相关
    * os - 系统io
  * main - 入口
    * version - 修改版本(README.md\package-lock.json\package.json)
  * object - 对象相关
    * id-generator-base - id生成器接口
  * plugin - 插件(第三方)
    * db - 数据库相关
      * mongo - mongodb相关
        * id-generator - 用mongo.ObjectID实现IDGeneratorBase
        * startup - 启动处理器
        * ... - mongodb CRUD
    * express - express扩展
    * redis - redis扩展
      * base.ts - reids接口
      * ioredis-adapter.ts - 基于ioredis的redis接口适配器
      * lock.ts - 基于redis的锁实现类
      * startup.ts - 启动处理器
  * thread - 线程相关
    * lock-base.ts - 锁基类
    * sleep.ts - 休眠函数