import logo from './web.png';
import PB from '../../photoblock/core/constants';

export default class WebContext {

    static Name = PB.WEB_CONTEXT_NAME;
    static Symbol = 'WWW';
    static LogoUrl = logo;
    static HdPath = 'm/255\'/255\'/255\'/255';
    static Attributes = ['userId', 'displayName', '\'publicKey']; 
    static Handlers = {
        'generateAccounts': WebContext.generateAccounts,
        'sign': WebContext.sign
    }

    static generateAccounts(accountSeed, userInfo, count = 1) {
        // Web context ignores count...only one account per PhotoBlock is supported
        
        return [userInfo];
    }

    static sign(data, reason, callback) {}

    

}