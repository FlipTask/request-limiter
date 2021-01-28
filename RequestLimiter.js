/**
 *  class Request
 */
function delay(time){
    return new Promise((res) => setTimeout(res, time))
}
function Axios(args){
    return new Promise((res) => {
        res();
    })
}

class RequestLimiter {
    constructor(max = 3) {
        this.maxAllowed = max;
        this.pendingRequests = 0;
        this.queue = [];
        this.RequestTypes = ["get", "post","put","patch","delete"];
        this.RequestTypes.forEach((type) => {
            this[type] = this.httpRequest
        })
    }

    incrementPending() {
        this.pendingRequests++;
    }

    decrementPending() {
        this.pendingRequests--;
    }

    executeNext(request) {
        let isResolved = false
        return new Promise((resolve) => {
            setInterval(() => {
                if(this.pendingRequests < this.maxAllowed && !isResolved) {
                    resolve(new Promise(request))
                    isResolved = true;
                }
            }, 500);
        })
    }

    httpRequest(param) {
        const args = [...arguments];
        const promise = async(resolve, reject) => {
            this.incrementPending();
            await delay(2000)
            return Axios.apply(null, args).then(res => {
                console.log("resolved", param)
                resolve()
                this.decrementPending();
            }).catch(err => {
                this.decrementPending();
                return err;
            });
        }
        if(this.pendingRequests < this.maxAllowed) {
            return new Promise(promise)
        }else {
            return this.executeNext(promise);
        }
    }
}

const r = new RequestLimiter();

r.get("A")
setTimeout(() => {
    r.get("B");
}, 200)
setTimeout(() => {
    r.get("C");
}, 500)
setTimeout(() => {
    r.get("D");
}, 1000)
setTimeout(() => {
    r.get("E");
}, 1200)
setTimeout(() => {
    r.get("F");
}, 1500)
setTimeout(() => {
    r.get("G");
}, 2000)
setTimeout(() => {
    r.get("H");
}, 2000)
setTimeout(() => {
    r.get("I");
}, 2100)

