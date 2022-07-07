import { v4 as uuidv4 } from 'uuid';

import mongooseService from '../../common/services/mongoose.service';
import { PermissionFlag } from '../../common/middleware/permission.middleware';
import { UserDto } from '../dto/user.dto';
import { CreateUserDto } from '../dto/create.user.dto';
import { PutUserDto } from '../dto/put.user.dto';
import { PatchUserDto } from '../dto/patch.user.dto';


class UsersDao {
    Schema = mongooseService.getMongoose().Schema;

    userSchema = new this.Schema({
        _id: String,
        email: String,
        password: { type: String, select: false },
        name: String,
        permissionFlags: { type: Number, default: PermissionFlag.PUBLIC },
        __v: { type: Number, select: false },
    }, { id: false });

    User = mongooseService.getMongoose().model('User', this.userSchema);

    async addUser(userFields: CreateUserDto): Promise<UserDto['_id']> {
        const userId = uuidv4();
        const user = new this.User({
            _id: userId,
            ...userFields,
        });
        await user.save();
        return userId;
    }

    getUserByEmail(email: string): Promise<Omit<UserDto, 'password'>> {
        return this.User.findOne({ email }).exec();
    }

    getUserByEmailWithPassword(email: string): Promise<UserDto> {
        return this.User.findOne({ email }, '_id email name permissionFlags +password').exec();
    }

    removeUserById(userId: string) {
        return this.User.deleteOne({ _id: userId }).exec();
    }

    getUserById(userId: string): Promise<Omit<UserDto, 'password'>> {
        return this.User.findById(userId).exec();
    }

    getUsers(limit = 25, page = 0): Promise<Omit<UserDto, 'password'>[]> {
        return this.User.find({}, null, { limit, skip: limit * page }).exec();
    }

    updateUserById(userId: string, userFields: PatchUserDto | PutUserDto): Promise<Omit<UserDto, 'password'>> {
        return this.User.findByIdAndUpdate(
            userId,
            { $set: userFields },
            { new: true }
        ).exec();
    }
}

export default new UsersDao();
