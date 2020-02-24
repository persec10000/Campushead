export default class Utils{
    static isEmptyOrZero(val){
        if(val == null|| val == undefined|| val==0 || val=='') return true;
        return false;
    }

    static isEmpty(val){
        if(val == null|| val ==undefined||  val=='' ) return true;
        return false;
    }

    static isNotEmptyOrZero(val){
        if(val != null && val != undefined && val!=0 && val!='') return true;
        return false;
    }

    static isNotEmpty(val){
        if(val != null && val != undefined && val!='') return true;
        return false;
    }

    /**
     * check tot contains part, if contains return true, else false.
     */
    static isContain(tot, part){
        const _tot = tot.toUpperCase ();
        const _part = part.toUpperCase ();
        return _tot.indexOf (_part) > -1;
    }
/**
 * 
 * @param {number} length 
 */
    static makeRandomStr(length){
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
           result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
    static  limit = 10;
    static sbtLimit = 2; 
}