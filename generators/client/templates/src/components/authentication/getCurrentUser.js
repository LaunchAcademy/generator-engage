const getCurrentUser = () => {
  return fetch("/api/v1/user-sessions/current", {
    method: "get",
    headers: new Headers({
      "Content-Type": "application/json",
    }),
  }).then((resp) => {
    if (resp.ok) {
      return resp.json().then((user) => {
        return user;
      });
    } else {
      const errorMessage = `${resp.status} (${resp.statusText})`;
      const error = new Error(errorMessage);
      throw error;
    }
  });
};

export default getCurrentUser;
