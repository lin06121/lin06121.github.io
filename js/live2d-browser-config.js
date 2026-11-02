window.blogLive2dConfig = {"cdn":"https://unpkg.com/oh-my-live2d","options":{"dockedPosition":"right","mobileDisplay":false,"menus":{},"models":[{"path":"/live2d-models/adaerbote_3/adaerbote_3.model3.json","scale":0.08,"position":[-60,-50],"stageStyle":{"width":360,"height":360},"mobileScale":0.08,"mobilePosition":[-10,23],"mobileStageStyle":{"width":200,"height":200}},{"path":"/live2d-models/adaerbote_2/adaerbote_2.model3.json","scale":0.08,"position":[-60,-50],"stageStyle":{"width":360,"height":360},"mobileScale":0.08,"mobilePosition":[-10,23],"mobileStageStyle":{"width":200,"height":200}},{"path":"/live2d-models/abeikelongbi_3/abeikelongbi_3.model3.json","scale":0.08,"position":[-60,-50],"stageStyle":{"width":360,"height":360},"mobileScale":0.08,"mobilePosition":[-10,23],"mobileStageStyle":{"width":200,"height":200}},{"path":"/live2d-models/dafeng_2/dafeng_2.model3.json","scale":0.08,"position":[-60,-80],"stageStyle":{"width":360,"height":360},"mobileScale":0.08,"mobilePosition":[-10,23],"mobileStageStyle":{"width":200,"height":200}},{"path":"/live2d-models/jianye_2/jianye_2.model3.json","scale":0.05,"position":[-60,-60],"stageStyle":{"width":360,"height":360},"mobileScale":0.08,"mobilePosition":[-10,23],"mobileStageStyle":{"width":200,"height":200}}],"primaryColor":"var(--btn-bg)","tips":{"style":{"width":230,"height":120,"left":"calc(50% - 20px)","top":"-100px"},"mobileStyle":{"width":180,"height":80,"left":"calc(50% - 30px)","top":"-100px"},"idleTips":{"interval":15000,"message":["你好呀，欢迎来到 Yulin's Jungle~","今天也是美好的一天呢 ✨","有空常来看看哦 💜"]}}}};
window.blogLive2dConfig.options.menus.items = ((defaultItems) => {
  // 过滤掉默认的 about 项
  const filtered = defaultItems.filter(function(item) {
    return item.id !== 'about';
  });
  return [
    { id: 'home', icon: 'home', title: '回到首页', onClick: function() { window.location.href = '/'; } },
    ...filtered
  ];
});
