import User from "../service/User.interface"

export default interface KeyValues {
	[key: string]:string
}



export const toKeyValues = (user: User): KeyValues => {
	    //Deep copy to avoid deleting properties of user param
			const params = JSON.parse(JSON.stringify(user))
			delete params.documentDIDs
			delete params.hash
			delete params.salt
			delete params.id
			return params as KeyValues
}