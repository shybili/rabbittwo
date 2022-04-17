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
					}
			}
	},
	mutations:{
		// 替换用户信息
		setName(state,payload){
			state.profile = payload
		}

	}
}