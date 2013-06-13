    
  
  //  源码写的有点恶心，大家别介意，有想法的话大家可以自行改改
  
  
   function lcz(){
	    var _this=this;
        this.lrc_object; 
     	this.lrc_lines;  
     	this.upkp ;  
     	this.classV1; 
     	this.classV2; 

     	this.initTop;  
     	this.center;  
     	this.empty;  
     	this.isDropLrc; 

		this.width;   
		this.height;
		this.align;
		this.oneline;
		this.luminous;
		this.change;
			
		this.staue=true;
			
     	this.tag = {};
		this.mould='<ul style="height: 300px;list-style: none;position: relative;line-height: 20px;padding: 0;overflow-y: hidden;display:none;"></ul>';
		this.getlrc="Value";   // 时间追踪器   默认 Vlue
     	
		var errmsg="程序发生异常，无法继续了！";
		
  
     	
     	
     	this.toTimer = function( time ) {
        var  m, s;
        m =  Math.floor( time / 60 );
        m = isNaN( m ) ? '--' : ( m >= 10 ) ? m : '0' + m;
        s = Math.floor( time % 60 );
        s = isNaN( s ) ? '--' : ( s >= 10 ) ? s : '0' + s;
        return m + ':' + s;
    };
			//  添加 li 列表
    	this.addLrc = function(cla,text,val){
    	   var lrc_line = document.createElement("li");
    	   	lrc_line.innerHTML = text?text:"";
    	   	lrc_line.className = cla?cla:"";
    	   	lrc_line.lang = val?val:"";
			this.lrc_object.appendChild(lrc_line);
			this.lrc_lines.push(lrc_line);
    	};
    	
         this.getLrcByValue = function(val){
         		le = this.lrc_lines.length
         		val = "^"+val+".*";
             for ( var i = 0; i < le; i++) {
				if(this.lrc_lines[i].lang.search(val)==0)return this.lrc_lines[i];
             }
			return null;
         };
         this.getLrcByValueInd = function(val){
      		le = this.lrc_lines.length-1
          for ( var i = le; i >= 0; i--) {
        	  p = this.lrc_lines[i].lang;
        	  if(p)
				if(p<val)return this.lrc_lines[i];
          }
			return null;
      };
         	
         this.setClassName= function(obj,className){if(obj)obj.className=className;};
         
         this.upTop = function(obj){
         	var thisTop = obj.offsetTop;   
         	var st =  this.lrc_object.scrollTop;  
         	var nextTop = thisTop-this.center;  
         	this.myf(this.lrc_object, st, nextTop);
         };
         	
         this.remove = function(){	
          	
          	if(this.lrc_lines!=null)
        	for ( var i = 0; i < this.lrc_lines.length; i++) {
				this.lrc_object.removeChild(this.lrc_lines[i]);
			}
			
				this.lrc_lines=new Array();
				
				if(!this.empty && this.empty!=0)
					alert("empty 属性有误! 该值必须>=零");
			this.setNbsp();	
         };
         		
         	this.setNbsp=function(){
         		for ( var it = 0; it < this.empty; it++) {   //头空白
					this.addLrc("", "&nbsp;", "");
					}
         	}
         	
         	
         this.load = function(json,fun) {  	
         	lrcs = json["lrcs"];
			end=json[this.tag.end];
			with(this){
				remove();   //初始化变量
         	_addLrc(json[this.tag.sname]); 
         	_addLrc(json[this.tag.cname]);
         	_addLrc(json[this.tag.qname]);
         	_addLrc(json[this.tag.bname]);
         	_addLrc(json[this.tag.sgname]);
         	_addLrc(json[this.tag.special]);
         	_addLrc(json[this.tag.kname]);
				}
         	   if(lrcs)
         		for ( var index in lrcs) {
					this.addLrc(this.classV1, lrcs[index]["name"], lrcs[index]["time"]);
				}
				
         	if(end)
			end["time"]? this.addLrc(this.classV1, end["end"], end["time"]):this.addLrc(this.classV1, end);
			
         		this.setNbsp();
         	if(typeof fun =='function')
         	  fun.call(null,null);
				
         };
       this._addLrc =function(sup){
		 if(sup)sup["time"]? this.addLrc(this.classV1, sup["name"], sup["time"]):this.addLrc(this.classV1, sup);
					}
         this.Read = function(lrc,fun){
           if(fun!=null && typeof fun == "function") // 如果传入了解析函数， 就应该使用它，而不是使用原来的
           		return fun.call(this,lrc);        //使用者可以自定义解析方法
           		var jsons = {};
           		jsons["lrcs"] =new Array();
         	var lrs = lrc.split('['); 
         	var lejt = lrs.length;
         	for ( var i = 0; i < lejt; i++) {
				var element = lrs[i];
				var dic =  element.split(']');
         		if(dic.length==2)
         			if(dic[0].search("^[0-9]{2}:[0-9]{2}.[0-9]{2}$")<0){
         				
         					title =  dic[0].split(':');
         						jsons=tagswitch(title,jsons);
         		}else{
         				
         					var lt = {"time":dic[0],"name":dic[1]};
         					jsons["lrcs"].push(lt);
         		}
			}
			return jsons;
         };
         		// 一个高级解析器 能够解析如 [00:10.20][00:30.15] happy go 
        this.vls1 = function(lrc){
    	var jsons = {};
          jsons["lrcs"] =new Array();
    	var al = lrc.length;
    	var begin=0,end=0;
    	var arr = new Array();
    	for ( var i = 0; i < al; i++) {
			if(lrc[i]=='['){
				if(i>8)
				if((lrc.slice(i-9,i-1)+"").search("^[0-9]{2}:[0-9]{2}.[0-9]{2}$")<0){
					arr.push(lrc.substring(begin, i));	
					begin = i;
				}
			}
		}
    	  	arr.push(lrc.substring(begin, al));
    	  	var tempJson = {},times = [];
    	   for ( var i = 0; i < arr.length; i++) {
				var line =  arr[i]; 
				var li = line.split(']');
					if(li.length===2){    
						if((li[0]+"").search("^\\[[0-9]{2}:[0-9]{2}.[0-9]{2}$")<0){
									
								li[0] = li[0].slice(1);
								title = li[0].split(':');
								
								
								jsons=tagswitch(title,jsons);
								
         						
						}else{
								
								
								time = li[0].slice(1)+"";
         					tempJson[time]=li[1];  
         					times.push(time);
						}
					}else if(li.length>2){   
						var time,lrc;
						lrc = li[li.length-1];
						for(var element in li){
							if(li[element].search	("^\\[[0-9]{2}:[0-9]{2}.[0-9]{2}$")==0){  
								time = li[element].slice(1)+"";
								tempJson[time]=lrc;
								times.push(time);
							}
						}
					}
				}
    	  	times = times.sort();
    	  	for ( var element in times) {
    	  	 t = times[element];
				var lt = {"time":t,"name":tempJson[t]};
				jsons["lrcs"].push(lt);
			}
    	  	return jsons;
         };
         	
			var tagswitch=function(title,jsons){
								
         						if(title.length===2)
								tp=title[1];
								tag=_this.tag;
							switch(title[0]){
         						case tag.sname:jsons[tag.sname]=tp; break;
         						case tag.cname:jsons[tag.cname]=tp; break;
         						case tag.qname:jsons[tag.qname]=tp; break;
         						case tag.bname:jsons[tag.bname]=tp; break;
         						case tag.sgname:jsons[tag.sgname]=tp; break;
         						case tag.special:jsons[tag.special]=tp; break;
         						case tag.kname:jsons[tag.kname]=tp; break;
         						case tag.end:jsons[tag.end]=tp; break;
         					}
							return jsons;
				}
         		
         this.myf_Init = function(){
		
			// 构建元素

			this.lrc_object.innerHTML=this.mould;
			
			asc=this.lrc_object=this.lrc_object.firstChild;
			asc.style.width=this.width;
			asc.style.height=this.height;
			
			asc.style.textAlign=this.align;
			
			if(this.oneline){
					  
				this.empty=0;
				this.center=10;
					
				}else{
						this.empty=10;
				this.center=(this.lrc_object.style.height/2)|100;
					}
			
         	if(this.isDropLrc){  //注册拖动
         		this.logon(false);
         	}
		
         };
         
		 
			
					// 设置歌词处于 加亮状态
				this. setoccupy=function(line,fun){
						 line.style.display='block';
						 this.setClassName(line,this.classV2);
						 
						 this.upTop(line);
						  if(this.upkp) this.unoccupy(this.upkp);
						  this.upkp = line;
						if(fun){fun(line);}
					}
					// 设置歌词处于 普通状态
				this.unoccupy=function(line,fun){
						this.setClassName( line,this.classV1);
						if(this.oneline){
							line.style.display='none';
							}
						  if(fun){fun(line);}
					}
			
			
         this.torun = function(time){
			 if(!this.staue)
			return false;
          var time=this.toTimer(Math.round( (time|event.srcElement.currentTime) * 100 ) / 100); // 获取时间
          var line = eval('this.getLrcBy'+this.getlrc+'(time)');  
			
          	if(line){
					
						// 显示效果处理函数
						if(this.upkp!=line){
							this.setoccupy(line);
						}
				}
	        
         };
         
         	//注册鼠标拖入事件
         	//@param tag  接受拖入事件的 标签  的 id   默认为 body
         this.logon = function(tag){
         	if (window.FileReader) {

		var cnt = this.lrc_object;
          if(tag){
          cnt = document.getElementById(tag);
          }
		// 处理拖放文件列表
		function handleFileSelect(evt) {
			evt.stopPropagation();
			evt.preventDefault();

			var files = evt.dataTransfer.files;
		
		for (var i = 0, f; f = files[i]; i++) {
					var reader = new FileReader();
 					reader.onloadend = (function (theFile) {
						return function (e) {
							img = e.target.result;
							if(img)
							_this.load(_this.Read(img));
							
						};
					})(f)
    					reader.readAsText(f);
			}
		}
		
		// 处理插入拖出效果
		function handleDragEnter(evt){ //this.setAttribute('style', 'border-style:dashed;'); 
		}
		function handleDragLeave(evt){ //this.setAttribute('style', ''); 
		}

		// 处理文件拖入事件，防止浏览器默认事件带来的重定向
		function handleDragOver(evt) {
			evt.stopPropagation();
			evt.preventDefault();
		}
		
		cnt.addEventListener('dragenter', handleDragEnter, false);
		cnt.addEventListener('dragover', handleDragOver, false);
		cnt.addEventListener('drop', handleFileSelect, false);
		cnt.addEventListener('dragleave', handleDragLeave, false);
		cnt.addEventListener('ondragend', handleDragLeave, false);
		
	} else {
		alert('你的浏览器不支持啊，同学');
	}
   };
     	
     	var timer = null;  // 要用到的计时器
     this.myf=function(obj,f,m){
     		if(timer!=null){
     			clearTimeout(timer);
     		}
     		this.isUpOrDown(obj, f, m);
     };
	 getUpValue = function(f,m){
     	if((m-f)>100){
     				f+=30;
     			}else if((m-f)>50){
     			   f+=10;
     			}else if((m-f)>20){
     			   f+=5;
     			}else if((m-f)>1){
     			   f++;
     			}
     			return f;
     	};
     	
     	getDowmValue = function(f,m){
     	if((f-m)>100){
     			   f-=30;
     			}else if((f-m)>50){
     			   f-=10;
     			}else if((f-m)>20){
     			   f-=5;
     			}else if((f-m)>1){
     			   f--;
     			}
     			return f;
     	};
     this.isUpOrDown = function(obj,f,m){
     	(f<m)?this.toUp(obj, f, m):this.toDown(obj, f, m);
     };
	 
     this.toUp = function(obj,f,m){
	      timer = setInterval(function(){
	     			if(f>=m){
	     				clearTimeout(timer);timer=null;obj.scrollTop = m;
	     			}
	     			
	     			obj.scrollTop = f;
	     			f=getUpValue(f,m);
	     			
	     		}, 10);
     };
     this.toDown = function(obj,f,m){
	    timer = setInterval(function(){
	     			if(f<=m){
	     				clearTimeout(timer);timer=null;obj.scrollTop = m;
	     			}
	     			obj.scrollTop = f;
	     			f=getDowmValue(f,m);
	     			
	     		}, 30);
     };
	 
	 this.destory = function(){
		 
		 }
}
 
// useing

  // 指定一个div 放置位置
  // 设置文本字符串， 可设置url 自动读取
  // json 格式参数
  
  // 显示风格， 进度拖拽，歌词编辑
  /*   非常丰富的显示风格和特效，精彩纷呈。 
		1）多行、双行、单行；左、中、右、缩进；等多种排列方式； 
		2）卡拉OK、淡入淡出、背景透明、阴影、浮雕、轮廓等多种特效； 
		3）淡入淡出  切换歌词过渡效果； 
		4）窗口总在最前面或者粘附播放器或者完全嵌入播放器界面，可以可半透明，鼠标点击透明； 
		
	*/



lrc ={
			// 构建
			/*
				    基本参数
				absp{
					‘object’  // 页面内显示元素位置
					‘initTop’    // 歌词头初始位置
					‘center’    // 焦点位置
					‘empty’    // 构建头与尾部 的 空对象原始
					‘isDropLrc’  // 启用歌词拖入，仅支持现代浏览器，  默认（true） 
					'lrcUrl'    // 歌词文件路径
					'lrcText'   // 歌词文本
					
					'readType' ：歌词解析方式
					’seekMark‘ ：  寻找方式
					
					’syntony‘   ： 歌词解析完毕后的 回调函数
					
					'media'： 播放器对象  默认支持  audio  video
					
					'open': 显示开启
				}
					 样式参数
				style{
					'notoccupy'    //
					'occupy'  //
					width ：   宽度 
					height ：   高度
					
					align:   水平居中方式
					oneline  ：   单行显示
					luminous  ：  亮化特效
					
					change ： 歌词切换效果
				}
			*/
		  msg:{
				ms1:"元素位置没有给出！ error : 103",
				ms2:"请给出歌词的链接地址，或文本内容！ error : 105"
			  },
		tag:{
			sname :"ti",  //歌曲名
         	cname :"cl",  //作词
         	qname :"cs",  //作曲
         	bname :"ps",   //编曲
         	sgname :"ar",    //歌手名称
         	special :"al",   //所属专辑
         	kname :"by",		//歌词制作
         	end :"end"    //结束 语
			},
			
		build:function(absp,style){
				 var _baqi = new lcz(); 
					// 对象赋值
				 _baqi.tag=lrc.tag; 
				 if(!absp["object"]){
							alert(lrc.msg.ms1);
					 }else{
						 _baqi.lrc_object= document.getElementById(absp["object"]);
						 }	
					 
				_baqi.initTop=absp['initTop']!=null?absp['initTop']:0;
				_baqi.center=absp['center']!=null?absp['center']:0;
				_baqi.empty=absp['empty']!=null?absp['empty']:0;
				_baqi.isDropLrc=absp['isDropLrc']!=null?absp['isDropLrc']:true;
				_baqi.getlrc=absp['seekMark']!=null?absp['seekMark']:"Value";
				if(style){
				_baqi.classV1=style['notoccupy']!=null?style['notoccupy']:"lrc_moonlight";
				_baqi.classV2=style['occupy']!=null?style['occupy']:"lrc_attention";
				
				_baqi.width=style['width']!=null?style['width']:'550px';
				_baqi.height=style['height']!=null?style['height']:'200px';
				_baqi.align=style['align']!=null?style['align']:'center';
				
				_baqi.oneline=(style['oneline']!=null)?style['oneline']:false;

				//_baqi.luminous=style['luminous']!=null?style['luminous']:200;    // 加亮特效
				//_baqi.change=style['change']!=null?style['change']:200;      // 切换 特效
							
				}
		
				
				_baqi.myf_Init();
				if(lrc.readlrc(_baqi,absp['readType'],{'url':absp['lrcUrl']?absp['lrcUrl']:null,'text':absp['lrcText']?absp['lrcText']:null},function(){_baqi.lrc_object.scrollTop=_baqi.initTop;  if(_baqi.oneline){_baqi.lrc_object.className+=' lrc_hide';}  if(absp['syntony']) absp['syntony'](_baqi);})){
					
					if(absp['open']){
						lrc.open(_baqi);
					  }
					}
			


				if(absp['media']){	
						mp= document.getElementById(absp['media']);
					if (window.attachEvent)
							{
						mp.attachEvent('ontimeupdate', function(){_baqi.torun()});
						}else{
						mp.addEventListener('timeupdate', function(){_baqi.torun()}, false);
							}
					}
				
				 return _baqi;
				},
			// 动态加载歌词
			// sup 对象，fashion 读取方式，pas{ url: 连接, text: 文本 }   ， syntony  回调函数
		readlrc:function(sup,fashion,pas,syntony){
				var lrct="";
					if(pas['text']){
							lrct=pas['text'];
						}else if(pas['url']){
									
									
									xmlhttp=null;
if (window.XMLHttpRequest)
  {
  xmlhttp=new XMLHttpRequest();
  }
else if (window.ActiveXObject)
  {
  xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
  }
if (xmlhttp!=null)
  {
  xmlhttp.onreadystatechange=function()
				{
				if (xmlhttp.readyState==4)
				  {
				  if (xmlhttp.status==200)
					{
					
					lrct=xmlhttp.responseText;
					 lrct = lrct.replace(/<\/?.+?>/g,"").replace(/[\r\n]/g, ""); 
    	 				sup.load(sup.Read(lrct,fashion),syntony);return true;
				
					}
				  else
					{
					alert("在获取url 歌词的时候发生了错误:" + xmlhttp.statusText);
					}
				  }
				};
  xmlhttp.open("GET",pas['url'],true);
  xmlhttp.send(null);
  }
	 
							}else{
									alert(lrc.msg.ms2);
									return false;
								}
					
				sup.load(sup.Read(lrct,fashion),syntony);
				return true;
			},
				// 代开歌词效果
			open:function(sup){
					if(sup.lrc_object)
				sup.lrc_object.style.display='block';
				sup.staue=true;
				},
				// 关闭歌词效果
			close:function(sup){
				if(sup.lrc_object)
				sup.lrc_object.style.display='none';
				sup.staue=false;
				},
			suspend:function(sup){
				if(sup.lrc_object)sup.staue=false;
				},
				// 销毁歌词对象效果
			destroy:function(sup){
				lrc.close(sup);
				sup.remove(sup.lrc_object);
				},
			// 设置进度时间
			setProgress:function(sup,time){
				sup.torun(time);
			}
}
	
