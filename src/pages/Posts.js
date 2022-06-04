import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Label,
  Modal,
  Select,
  Textarea,
  TextInput,
} from "flowbite-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationArrow,
  faTruck,
  faCalendar,
  faPen,
  faMoneyBill,
  faTrashCan,
  faMessage,
  faFeatherPointed,
  faCircleExclamation,
  faAt,
} from "@fortawesome/free-solid-svg-icons";
import Container from "../components/Container";
import { fetcher, checkResponse } from "../utils/fetcher";
import Alert from "../utils/alert";
import { isAuthenticated } from "../utils/authenticated";
import messages from "../constants/messages";

function Posts() {
  const [showAddModal, toggleAddModal] = useState(false);
  const [showDeleteModal, toggleDeleteModal] = useState(false);
  const [deletedPost, selectDeletedPost] = useState(null);
  const [showMessageModal, toggleMessageModal] = useState(false);
  const [messagedPost, setMessagedPost] = useState(null);
  const [message, setMessage] = useState(null);
  const [showMessagesModal, toggleMessagesModal] = useState(false);
  const [currentPost, setCurrentPost] = useState({});

  const [posts, setPosts] = useState([]);
  const [visiblePosts, setVisiblePosts] = useState([]);

  function search(value) {
    setVisiblePosts(
      posts.filter((post) =>
        value ? post.title.toLowerCase().includes(value.toLowerCase()) : true
      )
    );
  }

  useEffect(() => {
    Alert.loading("Loading Posts");
    fetcher("posts", isAuthenticated())
      .then((res) => {
        Alert.abort();
        const data = checkResponse(res.data, "posts") || [];
        setPosts(data.filter((post) => post.active));
        setVisiblePosts(data);
      })
      .catch(Alert.error);
  }, []);

  const [postTitle, setPostTitle] = useState("");
  const [postDesc, setPostDesc] = useState("");
  const [postPrice, setPostPrice] = useState("");
  const [postLoc, setPostLoc] = useState("[On Request]");
  const [postDeliver, setPostDeliver] = useState(false);

  function post() {
    if (!postTitle) return Alert.error("Post Title", messages.required);
    if (!postDesc) return Alert.error("Post Description", messages.required);
    if (!postPrice) return Alert.error("Post Price", messages.required);
    Alert.loading("Adding Post");
    fetcher("posts", true, {
      post: {
        title: postTitle,
        description: postDesc,
        price: postPrice,
        location: postLoc !== "" ? postLoc : undefined,
        willDeliver: !!postDeliver,
      },
    })
      .then((res) => {
        const data = checkResponse(res.data);
        if (data) {
          toggleAddModal(false);
          Alert.success("Added Post Successfully", data.message);
          setPosts([data.post, ...posts]);
        }
      })
      .catch(Alert.error);
  }

  function deletePost() {
    Alert.loading("Deleting Post");
    fetcher(`posts/${deletedPost}`, true, undefined, "DELETE")
      .then((res) => {
        if (checkResponse(res.data)) {
          toggleDeleteModal(false);
          Alert.success("Deleted Post Successfully");
          const index = posts.indexOf(
            posts.filter((p) => p._id === deletedPost)[0]
          );
          const newPosts = [...posts];
          newPosts.splice(index, 1);
          setPosts(newPosts);
        }
      })
      .catch(Alert.error);
  }

  function addMessage() {
    if (!message) return Alert.error("Message", messages.required);
    Alert.loading("Adding Message");
    fetcher(`posts/${messagedPost}/messages`, true, {
      message: {
        content: message,
      },
    })
      .then((res) => {
        if (checkResponse(res.data)) {
          toggleMessageModal(false);
          Alert.success("Added Message Successfully");
        }
      })
      .catch(Alert.error);
  }

  return (
    <>
      <h1 className="mb-4 select-none text-center text-3xl">POSTS</h1>
      <Modal
        size="3xl"
        placement="top-center"
        show={showAddModal}
        onClose={() => toggleAddModal(false)}
      >
        <Modal.Header>ADD POST</Modal.Header>
        <Modal.Body className="flex flex-col gap-4">
          <div>
            <Label className="mb-2 block text-lg" htmlFor="post-title">
              Post Title
            </Label>
            <TextInput
              id="post-title"
              type="text"
              onInput={(e) => setPostTitle(e.target.value)}
            />
          </div>
          <div>
            <Label className="mb-2 block text-lg" htmlFor="post-desc">
              Post Description
            </Label>
            <Textarea
              id="post-desc"
              onInput={(e) => setPostDesc(e.target.value)}
            />
          </div>
          <div>
            <Label className="mb-2 block text-lg" htmlFor="post-price">
              Price
            </Label>
            <TextInput
              id="post-price"
              type="text"
              onInput={(e) => setPostPrice(e.target.value)}
            />
          </div>
          <div>
            <Label className="mb-2 block text-lg" htmlFor="post-loc">
              Location
            </Label>
            <TextInput
              id="post-loc"
              type="text"
              value={postLoc}
              onInput={(e) => setPostLoc(e.target.value)}
            />
          </div>
          <div>
            <Label className="mb-2 block text-lg" htmlFor="post-deliver">
              Will Deliver
            </Label>
            <Select
              id="post-deliver"
              type="text"
              sizing="lg"
              onChange={(e) => setPostDeliver(!!parseInt(e.target.value))}
            >
              <option value="0">No</option>
              <option value="1">Yes</option>
            </Select>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button color="alternative" onClick={() => toggleAddModal(false)}>
            CANCEL
          </Button>
          <Button color="green" onClick={post}>
            POST
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        size="md"
        placement="top-center"
        popup={true}
        show={showDeleteModal}
        onClose={() => toggleDeleteModal(false)}
      >
        <Modal.Header />
        <Modal.Body className="text-center">
          <FontAwesomeIcon
            icon={faCircleExclamation}
            size="5x"
            className="mb-4 text-red-700"
          />
          <h3 className="mb-5 select-none text-lg font-normal text-gray-500 dark:text-gray-400">
            Are you sure you want to delete this post?
          </h3>
          <div className="flex justify-center gap-4">
            <Button color="red" onClick={deletePost}>
              Yes, I'm sure
            </Button>
            <Button
              color="alternative"
              onClick={() => toggleDeleteModal(false)}
            >
              No, cancel
            </Button>
          </div>
        </Modal.Body>
      </Modal>
      <Modal
        size="2xl"
        placement="top-center"
        show={showMessageModal}
        onClose={() => toggleMessageModal(false)}
      >
        <Modal.Header>ADD MESSAGE</Modal.Header>
        <Modal.Body>
          <div>
            <Label className="mb-2 block text-lg" htmlFor="message">
              Message
            </Label>
            <Textarea
              id="message"
              onInput={(e) => setMessage(e.target.value)}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button color="alternative" onClick={() => toggleMessageModal(false)}>
            CANCEL
          </Button>
          <Button color="green" onClick={addMessage}>
            ADD
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        size="4xl"
        placement="top-center"
        show={showMessagesModal}
        onClose={() => toggleMessagesModal(false)}
      >
        <Modal.Header>MESSAGES</Modal.Header>
        <Modal.Body>
          <h2 className="mb-4 select-none text-xl font-bold tracking-tight text-gray-900 dark:text-white md:text-2xl">
            Messages for: {currentPost.title}
          </h2>
          <div className="flex flex-col gap-y-5">
            {(currentPost.messages || []).map((message) => (
              <Card>
                <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                  {message.content}
                </h5>
                <ul className="flex flex-wrap gap-x-6 font-normal text-gray-700 dark:text-gray-400">
                  <li class="flex gap-x-2">
                    <FontAwesomeIcon icon={faAt} size="lg" fixedWidth />
                    {message.fromUser.username}
                  </li>
                  <li class="flex gap-x-2">
                    <FontAwesomeIcon icon={faCalendar} size="lg" fixedWidth />
                    {message.createdAt}
                  </li>
                </ul>
              </Card>
            ))}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            color="alternative"
            onClick={() => toggleMessagesModal(false)}
          >
            CLOSE
          </Button>
        </Modal.Footer>
      </Modal>
      <Container>
        {isAuthenticated() && (
          <div className="flex justify-center">
            <Button
              color="green"
              onClick={() => {
                toggleAddModal(true);
              }}
            >
              ADD POST
            </Button>
          </div>
        )}
        <TextInput
          type="search"
          onInput={(e) => search(e.target.value)}
          placeholder="Search"
        />
        {visiblePosts.map((post) => (
          <Card key={post._id}>
            <div className="mb-2 text-center">
              <h5 className="font-bold tracking-tight text-gray-900 dark:text-white md:text-2xl">
                {post.title}
              </h5>
              <p className="font-normal text-gray-700 dark:text-gray-400">
                {post.author.username}
              </p>
            </div>
            <div className="flex select-none items-center gap-x-2 font-bold text-gray-900 dark:text-white">
              <FontAwesomeIcon icon={faMoneyBill} size="lg" fixedWidth />
              <span className="font-extrabold tracking-tight">
                {post.price}
              </span>
            </div>
            <ul className="flex flex-wrap gap-x-6 gap-y-2 font-bold">
              <li className="flex items-center gap-x-2">
                <FontAwesomeIcon icon={faLocationArrow} size="lg" fixedWidth />
                Location: {post.location}
              </li>
              <li className="flex items-center gap-x-2">
                <FontAwesomeIcon icon={faTruck} size="lg" fixedWidth />
                Will Deliver: {post.willDeliver ? "Yes" : "No"}
              </li>
              <li className="flex items-center gap-x-2">
                <FontAwesomeIcon icon={faCalendar} size="lg" fixedWidth />
                Created At: {post.createdAt}
              </li>
              <li className="flex items-center gap-x-2">
                <FontAwesomeIcon icon={faPen} size="lg" fixedWidth />
                Last Updated At: {post.updatedAt}
              </li>
            </ul>
            <p className="mt-1 mb-2">{post.description}</p>
            {post.isAuthor ? (
              <div className="flex justify-center gap-x-4">
                <Button
                  size="lg"
                  onClick={() => {
                    setCurrentPost(post);
                    toggleMessagesModal(true);
                  }}
                >
                  <FontAwesomeIcon icon={faMessage} size="lg" fixedWidth />
                </Button>
                <Button
                  size="lg"
                  color="red"
                  onClick={() => {
                    selectDeletedPost(post._id);
                    toggleDeleteModal(true);
                  }}
                >
                  <FontAwesomeIcon icon={faTrashCan} size="lg" fixedWidth />
                </Button>
              </div>
            ) : isAuthenticated() ? (
              <div className="flex justify-center gap-x-4">
                <Button
                  size="lg"
                  onClick={() => {
                    setMessagedPost(post._id);
                    toggleMessageModal(true);
                  }}
                >
                  <FontAwesomeIcon
                    icon={faFeatherPointed}
                    size="lg"
                    fixedWidth
                  />
                </Button>
              </div>
            ) : (
              <span></span>
            )}
          </Card>
        ))}
      </Container>
    </>
  );
}

export default Posts;
