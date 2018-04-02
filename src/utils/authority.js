// use localStorage to store the authority info, which might be sent from server in actual project.
export function getAuthority() {
    return localStorage.getItem('antd-pro-authority') || '';
}

export function setAuthority(authority) {
    return localStorage.setItem('antd-pro-authority', authority);
}

export function getUserName() {
    return localStorage.getItem('antd-pro-username') || '';
}

export function setUserName(username) {
    return localStorage.setItem('antd-pro-username', username);
}
export function getUserId() {
    return localStorage.getItem('antd-pro-id') || '';
}

export function setUserId(id) {
    return localStorage.setItem('antd-pro-id', id);
}

