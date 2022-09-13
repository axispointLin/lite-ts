import { TracingConfig, TracingOptions } from 'jaeger-client';

/**
 * 默认配置
 */
export class Default {
    public cdnUrl: string;
    /**
     * 配置模型
     */
    public configModel: string;
    /**
     * 分布式mongo
     */
    public distributedMongo: string;
    /**
     * 枚举模型
     */
    public enumModel: string;
    /**
     * 枚举分隔符
     */
    public enumSep: string;
    /**
     * grpc proto文件地址
     */
    public grpcProtoFilePath: string;
    /**
     * log4js配置
     */
    public log4js: any;
    /**
     * mongo连接
     */
    public mongo: string;
    /**
     * 服务名
     */
    public name: string;
    /**
     * 链路调用
     */
    public openTracing: {
        /**
         * 跟踪配置
         */
        config: TracingConfig
        /**
         * 跟踪选项
         */
        options: TracingOptions
    };
    /**
     * 端口号
     */
    public port: {
        /**
         * grpc地址
         */
        grpc: number;
        /**
         * http
         */
        http: number;
    };
    public redis: {
        /**
         * ip地址
         */
        host: string;
        /**
         * 端口号
         */
        port: number;
    };
    /**
     * 版本(不需要配置)
     */
    public version: string;
}