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
		setName(state,payload){
			state.profile = payload
		}

	}
}