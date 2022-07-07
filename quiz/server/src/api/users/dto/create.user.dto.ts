import { UserDto } from './user.dto';

export interface CreateUserDto extends 
    Pick<UserDto, 'email' | 'password' | 'name'>, 
    Partial<Pick<UserDto, 'permissionFlags'>> {}
