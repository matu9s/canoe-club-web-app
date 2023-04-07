def is_authorized(current_user, sufficient_roles):
    for role in current_user.roles:
        if role.type in sufficient_roles:
            return True
    return False
