/**
 * 
 * @param ele [string] [生成组件的元素的dom对象]    
 * @param options [Object] [对组件设置的基本参数]
 * @return [function] [执行图片上传的函数] 
 */
function SimpleImgUpload(ele, options) {
	if (!ele) {
		return
	}
	//dom初始化
	var filesArr = [] //文件数组
	var inputfile = document.createElement('input');
	var imgcontainer = document.createElement('div');
	imgcontainer.className = 'imgcontainer';
	ele.appendChild(imgcontainer);
	var uploadbox = document.createElement('div');
	uploadbox.className = 'uploadbox';
	uploadbox.innerText = '+';
	ele.appendChild(uploadbox);
	inputfile.type = 'file';
	inputfile.id = 'inputfile'
	if (options.multiple) {
		inputfile.multiple = 'multiple'
	}
	ele.appendChild(inputfile);
	var imgloading=null;
	if (options.nowUpload) {
		imgloading = document.createElement('div');
		imgloading.className = "imgloading";
		imgloading.innerText = "上传中";
	}
	//事件绑定
	uploadbox.onclick = function () {
		inputfile.value = null;
		inputfile.click();
	}
	inputfile.addEventListener('change', handleFileSelect, false);

	//图片选择
	function handleFileSelect(e) {
		var files = inputfile.files;
		for (var i = 0; i < files.length; i++) {
			if (!/jpg|jpeg|gif|png/.test(files[i].type)) {
				console.log('文件格式不对！');
				continue;
			}
			var render = new FileReader();
			render.readAsDataURL(files[i]);
			filesArr.push(files[i]);
			render.onload = (e) => {
				var oDiv = document.createElement('div');
				oDiv.className = "imgbox";
				if(imgloading){
					oDiv.appendChild(imgloading);
				}
				var imgdeletebtn = document.createElement('i');
				imgdeletebtn.className = "imgdeletebtn"
				imgdeletebtn.innerText = "x";
				oDiv.appendChild(imgdeletebtn);
				var img = document.createElement('img');
				img.src = e.target.result;
				oDiv.appendChild(img);
				imgcontainer.appendChild(oDiv)
				imgdeletebtn.addEventListener('click', removeImg, false);
			}
			if(options.nowUpload){
				uploadSingleImg(files[i]);
			}
		}
	}

	function removeImg(e) {
		var pNode = e.target.parentNode.parentNode;
		if (pNode.className === 'imgcontainer') {
			function getIndex(ele) {
				if (ele && ele.nodeType && ele.nodeType === 1) {
					var cNode = pNode.children;
					for (var i = 0; i < cNode.length; i++) {
						if (cNode[i] === ele)
							return i;
					}
				} else {
					return -1;
				}
			}
			var index = getIndex(e.target.parentNode);
			pNode.removeChild(e.target.parentNode);
			if (index > 0) {
				filesArr.splice(index, 1)
			} else {
				return
			}
		} else {
			console.log('Dom结构错误');
		}
	}

	function uploadSingleImg(file) {
		var xhr = new XMLHttpRequest();
		var formData = new FormData();
		formData.append('files', file);
		xhr.onreadystatechange = function (e) {
			if (xhr.readyState === 4) {
				if (xhr.status === 200) {
					imgloading.innerText='上传成功';
					options.onSuccess(xhr.responseText);
				} else {
					imgloading.innerText='上传失败';
					options.onFailure(xhr.responseText);
				}
			}
		}
		xhr.upload.onprogress = e => {
			imgloading.innerText=`${parseInt(e.loaded / e.total * 100)}%`;
			if (Math.ceil(e.loaded / e.total * 100) === 100)
			imgloading.innerText=`正在压缩`;
		}
		xhr.upload.onerror=e=>{
			imgloading.innerText='上传失败';
		}
		xhr.open('POST', options.path, true);
		xhr.send(formData);
	}

	function uploadAllImg() {
		var xhr = new XMLHttpRequest();
		var formData = new FormData();
		for (var i = 0; i < filesArr.length; i++) {
			formData.append('files', filesArr[i]);
		}
		xhr.onreadystatechange = function (e) {
			if (xhr.readyState === 4) {
				if (xhr.status === 200) {
					options.onSuccess(xhr.responseText);
				} else {
					options.onFailure(xhr.responseText);
				}
			}
		}
		xhr.open('POST', options.path, true);
		xhr.send(formData);
	}

	return options.nowUpload?'':uploadAllImg
}