//用户模块
export default {
	namespaced:true,
	state(){
			return {
					profile:{
						id :'',
						avatar:'',
						nickname:'',//
						account:'',//用户名
						mobile:'',
						token:''
					},
					// 默认跳转到首页
					redirectUrl: '/'
			}
	},
	mutations:{
		// 替换用户信息
		setName(state,payload){
			state.profile = payload
		},
		// 更改跳转地址
		setRedirectUrl (state,url) {
			state.redirectUrl = url
		}

	}
}