/**
 *做一个约定，设置缓存的时候类型为：Object
 *否则要改写JSON.stringify和JSON.parse做判断
 */
/*Cookie*/
/**
 * 设置cookie
 * @param  key
 * @param  val
 * @param  days   时间：默认12小时、，单位：天
 * @param  path   域名下的路径：默认：/
 * @param  domain 域名
 */
export const setCookie = (key, val, days, path, domain) => {
    let expire = new Date();
    expire.setTime(expire.getTime() + (days ? 3600000 * 24 * days : 0.5 * 24 * 60 * 60 * 1000)); // 默认12小时
    document.cookie = key + '=' + encodeURIComponent(JSON.stringify(val)) + ';expires=' + expire.toGMTString() + ';path=' + (path ? path : '/') + ';' + (domain ? ('domain=' + domain + ';') : '');
};
/**
 * 删除cookie
 */
export const delCookie = (key, path, domain) => {
    let expires = new Date(0);
    document.cookie = key + '=;expires=' + expires.toUTCString() + ';path=' + (path ? path : '/') + ';' + (domain ? ('domain=' + domain + ';') : '');
};
/**
 * 获取cookie
 */
export const getCookie = (key) => {
    let arr=[], reg = new RegExp("(^| )" + key + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg))
        return unescape(arr[2]);
    else
        return null;
};

export const title = function(title) {
    title = title ? `${title} - 钱保姆后台管理系统` : '钱保姆后台管理系统';
    window.document.title = title;
};
/**
 * 判断是否可以进行localStorage
 */
const isAvailable = (() => {
    const test = 'test';
    try {
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
    } catch (e) {
        return false;
    }
})();
/**
 * 设置缓存
 * @param key 保存的键值
 * @param val 保存的内容
 */
export const setItem = (key, val) => {
    val = JSON.stringify(val);
    if (isAvailable) {
        localStorage.setItem(key, val);
    }
};


/**
 * 获取缓存
 * @param  {[String]} key 获取的键值
 * @return {Object}
 */
export const getItem = (key) => {
    if (isAvailable) {
        return localStorage.getItem(key) && JSON.parse(localStorage.getItem(key));
    }
};
/**
 * 删除缓存
 * @param  {[String]} key 删除的键值
 */
export const delItem = (key) => {
    if (isAvailable) {
        localStorage.removeItem(key);
    }
};

/**
 * 设置会话缓存
 * @param key 保存的键值
 * @param val 保存的内容
 */
export const setSessionItem = (key, val) => {
    val = JSON.stringify(val);
    if (isAvailable) {
        sessionStorage.setItem(key, val);
    }
};


/**
 * 获取会话缓存
 * @param  {[String]} key 获取的键值
 * @return {Object}
 */
export const getSessionItem = (key) => {
    if (isAvailable) {
        return sessionStorage.getItem(key) && JSON.parse(sessionStorage.getItem(key));
    }
};
/**
 * 删除会话缓存
 * @param  {[String]} key 删除的键值
 */
export const delSessionItem = (key) => {
    if (isAvailable) {
        sessionStorage.removeItem(key);
    }
};



export const getDevice = () => {
    const device = {};
    const ua = navigator.userAgent;

    const android = ua.match(/(Android);?[\s\/]+([\d.]+)?/);
    const ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
    const ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/);
    const iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/);

    device.ios = device.android = device.iphone = device.ipad = device.androidChrome = false;

    // Android
    if (android) {
        device.os = 'android';
        device.osVersion = android[2];
        device.android = true;
        device.androidChrome = ua.toLowerCase().indexOf('chrome') >= 0;
    }
    if (ipad || iphone || ipod) {
        device.os = 'ios';
        device.ios = true;
    }
    // iOS
    if (iphone && !ipod) {
        device.osVersion = iphone[2].replace(/_/g, '.');
        device.iphone = true;
    }
    if (ipad) {
        device.osVersion = ipad[2].replace(/_/g, '.');
        device.ipad = true;
    }
    if (ipod) {
        device.osVersion = ipod[3] ? ipod[3].replace(/_/g, '.') : null;
        device.iphone = true;
    }
    // iOS 8+ changed UA
    if (device.ios && device.osVersion && ua.indexOf('Version/') >= 0) {
        if (device.osVersion.split('.')[0] === '10') {
            device.osVersion = ua.toLowerCase().split('version/')[1].split(' ')[0];
        }
    }
    // Webview
    device.webView = (iphone || ipad || ipod) && ua.match(/.*AppleWebKit(?!.*Safari)/i);
    // keng..
    // device.weixin = /MicroMessenger/i.test(ua);
    return device;
};
/**
 * 重构url
 * @param  {Object}
 * @return {String}
 */
export const constructUrl = (route) => { //创建新的url
    const {
        path,
        query
    } = route;
    let result = path.join('/');
    let queryArr = [];
    if (query && typeof query === 'object') {
        queryArr = Object.keys(query).sort()
            .filter(key => query[key] !== null)
            .map(key => `${key}=${query[key]}`);
    }

    if (queryArr.length > 0) {
        result += `?${queryArr.join('&')}`;
    }

    return result;
};
/**
 * 解析url
 * @param  {String} windowHash = location.pathname
 * @return {Object}
 */
export const parseUrl = (windowHash = location.pathname) => { //解析url
    let path = [];
    const query = {};
    //windowHash = location.hash;
    //const hashArr = windowHash.replace('#/', '').split('?');
    const hashArr = windowHash.replace('/', '').split('?');
    path = hashArr[0].split('/');

    if (hashArr.length > 1) {
        hashArr[1].split('&').forEach(str => {
            const arr = str.split('=');
            const key = arr[0];
            const value = arr[1];
            if (isNaN(value)) {
                query[key] = value;
            } else {
                query[key] = Number(value);
            }
        });
    }

    return {
        path,
        query
    };
};
/**
 * 重构Url
 * @param  {[type]} paramObj url的参数对象
 * @param  {[type]} url      url
 * @return {[type]}          新的url
 */
export const hashUrl = (paramObj, url) => {
    let paramArray = [];
    for (let key in paramObj) {
        if (paramObj[key]) { //过滤掉值为null,undefined,''情况
            paramArray = [...paramArray, `${key}=${paramObj[key]}`];
        }
    }
    return `${url}?${paramArray.join('&')}`;
};
/**
 * 查找url中key的值
 * @param  {String} key
 * @param  {String} urlInfo
 * @return {String}
 */
export const getUrlParam = (key, urlInfo) => {
    let regExp = new RegExp("(^|&)" + key + "=([^&]*)(&|$)");
    let url = urlInfo ? urlInfo.substring(urlInfo.indexOf('?')) : window.location.search;
    let value = decodeURI(url).substr(1).match(regExp);

    return value != null ? unescape(value[2]) : null;
};

/*验证数据*/
let obj = {
    validNum: {
        regex: /^\d+(\.\d+)?$/,
        error: "请输入正确数字"
    },
    validEmail: {
        regex: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/,
        error: "邮箱格式不正确"
    },
    validDate: {
        regex: /^\d{4}(\-|\/|\.)\d{1,2}\1\d{1,2}$/,
        error: "日期格式不正确"
    },
    validTime: {
        regex: /\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}/,
        error: "时间格式不正确"
    },
    validId: {
        //regex: /(^\d{15}$)|(^\d{17}([0-9]|X|x)$)/,
        regex: /(^[0-9a-zA-Z]{6,}$)/, //港澳台比较特殊
        error: "身份证格式不正确"
    },
    validPrice: {
        regex: /^([+-]?[1-9][\d]{0,3}|0)([.]?[\d]{1,2})?$/,
        error: "请输入正确金额"
    },
    validMobile: {
        regex: /^(13[0-9]|14[5|7]|15[^4|^\D]|17[0-9]|18[0-9])\d{8}$/,
        //regex: /^\d+(\.\d+)?$/,
        error: "请填写正确的手机号码"
    },
    validPhone: {
        regex: /^(\(\d{3,4}\)|\d{3,4}(-|\s)?)?\d{7,8}(-\d{1,4})?$/,
        error: "请填写正确的手机号码"
    },
    validPostalCode: {
        regex: /^\d{4}$/,
        error: "请输入4位短信验证码"
    },
    validZipCode: {
        regex: /^\d{6}$/,
        error: "请输入6位邮政编码"
    },
    validWeChat: {
        regex: /^[a-zA-Z\d_-]{5,}$/,
        error: "请输入正确的微信号"
    }
};
/**
 * 验证数据
 * @param  {String} rule 规则
 * @param  {String} value 校正的value
 * @param  {String} callback 回调报错
 * @return {String}
 */
export const dataValidity = (rule, value, callback) => {
    let error;
    if (rule.required && !value) {
        error = rule.name + "必填";
        callback(error);
        return false;
    }
    if (rule.type == 'validMobile') {
        value = value.replace(/\s/g, '');
    }
    if (obj[rule.type] && value && !obj[rule.type].regex.test(value)) {
        error = obj[rule.type].error;
        callback(error);
    } else {
        callback();
    }
};
/**
 * 初始化数据
 * @param  {String} res 传入的数据
 * @param  {String} id  数组是已str区分 ，默认'id'
 * @param  {String} _count
 * @param  {Object} initObj 判断是否有init
 * @param  {Array} initArr 判断是否有init
 * @return {String}
 * 参考reducers中的使用
 */
export const initItem = (res, str, count, initObj, initArr) => {
    let itemArr = [];
    let itemObj = {};
    let data;
    let id = str || 'id';
    if (typeof res == "object" && res.data && res.data instanceof Array) { //传入的不是数组。res.data是数组
        data = res.data;
    } else if (res instanceof Array) { //传入的是数组
        data = res;
    } else {
        return console.error('初始化参数错误');
    }
    for (let i = 0; i < data.length; i++) {
        itemArr = [...itemArr, data[i][id]];
        itemObj = {
            ...itemObj,
            [data[i][id]]: initObj || data[i]
        };
    }
    /*判断是否有_count*/
    if (count) {
        let {
            _count
        } = res;
        return {
            itemArr,
            itemObj,
            _count
        };
    } else {
        return {
            itemArr,
            itemObj
        };
    }
};
/**
 * 作为分页初始数据
 */
export const initObj = {
    curPage: 0, //当前页数
    totalPage: 1, //总页数
    pageSize: 10, //条数
    isEnd: 0, //是否正在加载 0 上拉加载，1为加载中，2为已全部加载,3数据异常
    itemArr: [],
    itemObj: {}
};

/**
 * 对自定义链接做处理
 */
export const diyLink = (event) => {
    const url = event.currentTarget.getAttribute('href');
    if (/^((https|http|ftp|rtsp|mms)?:\/\/)/.test(url) && !url.includes('weiyianws') && !url.includes('test.grws')) {
        location.href = url;
        event.preventDefault();
        return false;
    } else {
        _global.scroll[url] = 0;
    }
};
/**
 * 记忆滚动监听需要初始化
 */
export const initLink = (event) => {
    const url = event.currentTarget.getAttribute('href');
    _global.scroll[url] = 0;
    if (url === location.pathname) {
        document.body.scrollTop = 0;
    }
};

/**
 * 跳转对应的链接
 */
export const toDefaultPage = function (routers, name, route, next, path) {
    let len = routers.length;
    let i = 0;
    let notHandle = true;
    while (i < len) {
        if (routers[i].name === name && routers[i].children && routers[i].redirect === undefined) {
            route.replace({
                name: routers[i].children[0].name
            });
            notHandle = false;
            next();
            break;
        }
        i++;
    }
    if (notHandle) {
        next();
    }
    getPathNames(route.app, path);
};

/**
 * 判断数组内是否存在改元素
 */
export const oneOf = function (ele, targetArr) {
    if (targetArr.indexOf(ele) >= 0) {
        return true;
    } else {
        return false;
    }
};
const digitsRE = /(\d{3})(?=\d)/g;


export const handleTitle = function (vm, item) {
    if (typeof item.title === 'object') {
        return vm.$t(item.title);
    } else {
        return item.title;
    }
};



export const getRouterObjByName = function (routers, name) {
    if (!name || !routers || !routers.length) {
        return null;
    }
    // debugger;
    let routerObj = null;
    for (let item of routers) {
        if (item.name === name) {
            return item;
        }
        routerObj = getRouterObjByName(item.children, name);
        if (routerObj) {
            return routerObj;
        }
    }
    return null;
};

export function currency(value, currency, decimals) {
    value = parseFloat(value);
    if (!isFinite(value) || (!value && value !== 0)) return '';
    currency = currency != null ? currency : '$';
    decimals = decimals != null ? decimals : 2;
    let stringified = Math.abs(value).toFixed(decimals);
    let _int = decimals ? stringified.slice(0, -1 - decimals) : stringified;
    let i = _int.length % 3;
    let head = i > 0 ? (_int.slice(0, i) + (_int.length > 3 ? ',' : '')) : '';
    let _float = decimals ? stringified.slice(-1 - decimals) : '';
    let sign = value < 0 ? '-' : '';
    return sign + currency + head +
        _int.slice(i).replace(digitsRE, '$1,') +
        _float;
};

export const getPathNames = function (vm, path){
    setTimeout(function() {
        vm.$store.dispatch('getNames', path);
    },0);
};
export const getRoutes = (data) => {
    //动态获取页面 + 设置路由
    let pageData = []; //后台返回页面信息
    let pageRouters = []; //动态添加路由
    pageData = data;
    for (let i = 0; i < pageData.length; i++) {
        pageData[i] = {
            ...pageData[i],
            path: '/' + pageData[i].name,
            // component: Home
        };
        let $children = [...pageData[i].children];
        for (let j = 0; j < $children.length; j++) {
            // let component = {};
            // for (let k = 0; k < components.length; k++) {
            // 	if (components[k].name == $children[j].name) {
            // 		component = components[k];
            // 	}
            // }

            $children[j] = {
                ...$children[j],
                name: '' + $children[j].name,
                path: $children[j].name,
                // component: component,
                meta: {
                    title: $children[j].title
                }
            };
        }
        pageData[i] = {
            ...pageData[i],
            children: $children
        };
        pageRouters = [
            ...pageRouters,
            pageData[i]
        ];
    }
    return pageRouters;
    // const pm = new Promise((resolve, reject) => {
    // 	setItem('pageRouters', pageRouters);
    // 	resolve && resolve();
    // });

    // pm.then(()=> {
    // 	this.$router.push({
    // 		name: 'home'
    // 	});
    // });
};


function add0(m){
    return m<10? '0' + m : m;
}
//格式化时间戳
export const formatTimestamp = (timestamp, format='-') => {
    let time = new Date(timestamp*1000);
    let y = time.getFullYear();
    let m = time.getMonth()+1;
    let d = time.getDate();
    let h = time.getHours();
    let mm = time.getMinutes();
    let s = time.getSeconds();
    return y + format + add0(m) + format + add0(d) + ' ' + add0(h) + ':' + add0(mm) + ':' + add0(s);
};
