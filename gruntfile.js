/**
 * Created by huangfy on 2017/3/2.
 */

/**
 * grunt-watch 和 grunt-nodemon 都可以监听文件的改变。
 * 不同点：grunt-nodemon 当文件改变的时候，重启服务器；
 *         grunt-watch 当文件改变的时候，可以注册其他任务。
 *
 * grunt-concurrent 同时运行 grunt 任务
 * */
module.exports = function(grunt){
    // 任务配置，所有插件的配置信息
    grunt.initConfig({
        watch: {
            jade: {
                files: ["views/**"],
                options: {
                    livereload: true // 及时刷新
                }
            },
            js: {
                files: ["public/js/**","models/**/*.js","schemas/**/*.js"],
                //tasks: ["jshint"],
                options: {
                    livereload: true
                }
            }
        },
        nodemon: {
            dev: {
                script: 'app.js',
                options: {
                    args: [],
                    nodeArgs: ['--debug'],
                    ignore: ['README.md', 'node_modules/**', '.DS_Store'],
                    ext: 'js',
                    watch: ['./'],
                    delay: 1000,
                    env: {
                        PORT: '27017'
                    },
                    cwd: __dirname
                }
            }
        },
        concurrent: {
            tasks: ["nodemon","watch"],
            options: {
                logConcurrentOutput: true
            }
        },
        mochaTest: {
            options: {
                reporter: "spec"
            },
            src: ["test/**/*.js"]
        }
    });

    // 载入任务
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-nodemon");
    grunt.loadNpmTasks("grunt-concurrent");
    grunt.loadNpmTasks("mocha");

    grunt.option("force",true);

    // 注册任务，告诉grunt当我们在终端中输入grunt时需要做些什么（注意先后顺序）
    grunt.registerTask("default",["concurrent"]);
    grunt.registerTask("test",["mochaTest"]);
};