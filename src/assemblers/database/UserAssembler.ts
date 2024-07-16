import { User } from "@prisma/client";
import { UserListResponse } from "@responseType";

export default class UserAssembler {
    public assembleUserForLists(userRecord: User): UserListResponse {
        return {
            id: userRecord.id,
            first_name: userRecord.first_name,
            last_name: userRecord.last_name,
            email: userRecord.email,
            created_at: userRecord.created_at,
            updated_at: userRecord.updated_at
        }
    }
}
