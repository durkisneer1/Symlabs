<?php

namespace App\Enums;

enum TeamPermission: string
{
    case UpdateTeam = 'team:update';
    case DeleteTeam = 'team:delete';

    case AddMember = 'member:add';
    case UpdateMember = 'member:update';
    case RemoveMember = 'member:remove';

    case CreateInvitation = 'invitation:create';
    case CancelInvitation = 'invitation:cancel';

    case AssignCoursework = 'coursework:assign';
    case ViewStudentProgress = 'progress:view-students';
    case TakeAssignments = 'assignments:take';
    case ViewAsTeacher = 'view-as:teacher';
    case ViewAsStudent = 'view-as:student';
}
