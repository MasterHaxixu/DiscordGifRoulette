import { addChatBarButton, ChatBarButton, ChatBarProps } from "@api/ChatButtons";
import definePlugin from "@utils/types";
import { findByPropsLazy, proxyLazyWebpack } from "@webpack";
import { FluxDispatcher, MessageActions, SelectedChannelStore, UserSettingsActionCreators } from "@webpack/common";

const PendingReplyStore = findByPropsLazy("getPendingReply");

function sendMessage(channelId, message) {
    message = {
        invalidEmojis: [],
        tts: false,
        validNonShortcutEmojis: [],
        ...message
    };
    const reply = PendingReplyStore.getPendingReply(channelId);
    MessageActions.sendMessage(channelId, message, void 0, MessageActions.getSendMessageOptionsForReply(reply))
        .then(() => {
            if (reply) {
                FluxDispatcher.dispatch({ type: "DELETE_PENDING_REPLY", channelId });
            }
        });
}

const ChatBarIcon: ChatBarButton = ({ isMainChat }) => {
    if (!isMainChat) return null;
    var test = proxyLazyWebpack(() => UserSettingsActionCreators.FrecencyUserSettingsActionCreators);

    return (
        <ChatBarButton
            tooltip="GIF Roulette 🎲"
            onClick={() => {
                var randomGifsArray = test.getCurrentValue().favoriteGifs.gifs;
                const keys = Object.keys(randomGifsArray);
                var randomIndex = Math.floor(Math.random() * keys.length);
                var randomKey = keys[randomIndex];
                var channelId = SelectedChannelStore.getChannelId();
                sendMessage(channelId, { content: randomKey });
            }}
            buttonProps={{ "aria-haspopup": "dialog" }}
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke="currentColor" fill="none" />
                <circle cx="8" cy="8" r="1.5" fill="currentColor" />
                <circle cx="16" cy="8" r="1.5" fill="currentColor" />
                <circle cx="12" cy="12" r="1.5" fill="currentColor" />
                <circle cx="8" cy="16" r="1.5" fill="currentColor" />
                <circle cx="16" cy="16" r="1.5" fill="currentColor" />
            </svg>

        </ChatBarButton>
    );
};

export default definePlugin({
    name: "Random GIF",
    description: "Sends a random gif from your favourite gif selection",
    dependencies: ["ChatInputButtonAPI"],
    authors: [{
        name: "MasterHaxixu",
        id: 812721557612920893n
    }],
    start() {
        addChatBarButton("SendRandomGIF", ChatBarIcon);
    },
});