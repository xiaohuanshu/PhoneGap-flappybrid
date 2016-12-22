// 创建游戏显示区域，宽度为屏幕宽度，长度为490px
var game = new Phaser.Game(window.screen.availWidth * window.devicePixelRatio, 490, Phaser.CANVAS, 'game_div');

var game_state = {};

// 创建场景main
game_state.main = function() { };
game_state.main.prototype = {

    // 预加载所有的资源文件
    preload: function() {
        // 修改背景颜色
        this.game.stage.backgroundColor = '#71c5cf';

        // 加载精灵 鸟
        this.game.load.image('bird', 'assets/bird.png');

        // 加载精灵 管道
        this.game.load.image('pipe', 'assets/pipe.png');
    },

    // 游戏加载函数
    create: function() {
        // 将鸟显示在屏幕上
        this.bird = this.game.add.sprite(100, 245, 'bird');

        // 给鸟添加重力，从而使其自动降落
        this.bird.body.gravity.y = 1000;

        // 点击屏幕触发jump函数
        this.game.input.onDown.add(this.jump, this);

        // 创建一个由20个管道组成的组
        this.pipes = game.add.group();
        this.pipes.createMultiple(20, 'pipe');

        // Timer 每1.5秒执行add_row_of_pipes函数
        this.timer = this.game.time.events.loop(1500, this.add_row_of_pipes, this);

        // 在左上角显示分数
        this.score = 0;
        var style = { font: "30px Arial", fill: "#ffffff" };
        this.label_score = this.game.add.text(20, 20, "0", style);
    },

    // 此函数每秒执行60次
    update: function() {
        // 如果鸟飞出屏幕，则执行restart_game函数
        if (this.bird.inWorld == false)
            this.restart_game();

        // 物理碰撞： 如果鸟碰到管道，则执行restart_game函数
        this.game.physics.overlap(this.bird, this.pipes, this.restart_game, null, this);
    },

    // 让鸟跳跃
    jump: function() {
        // 给鸟在y轴上方向一个速度，从而跳跃
        this.bird.body.velocity.y = -350;
    },

    // 重置游戏
    restart_game: function() {
        //设备振动1s
        navigator.vibrate(300);
        // 删除所有的Timer
        this.game.time.events.remove(this.timer);

        // 重新执行main场景
        this.game.state.start('main');
    },

    // 在屏幕上添加一个管道
    add_one_pipe: function(x, y) {
        // 从管道组中获得第一个未被设置的管道
        var pipe = this.pipes.getFirstDead();

        // 设置位置
        pipe.reset(x, y);

         // 给管道一个向左的速度，从而自动移动
        pipe.body.velocity.x = -200;

        // 如果管道移动到屏幕之外则自动销毁
        pipe.outOfBoundsKill = true;
    },

    // 添加一行（7个）管道
    add_row_of_pipes: function() {
        var hole = Math.floor(Math.random()*5)+1; //随机取消一个管道
        //循环添加
        for (var i = 0; i < 8; i++)
            if (i != hole && i != hole +1)
                this.add_one_pipe(400, i*60+10);

        this.score += 1;
        this.label_score.content = this.score;
    },
};

// 执行main场景
game.state.add('main', game_state.main);
game.state.start('main');
