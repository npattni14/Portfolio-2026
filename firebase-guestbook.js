(()=>{
 const config={apiKey:'AIzaSyA_-pECpu3Zj2KjOEQ4vmVWSYzMIyX9zow',authDomain:'portfolio-2026-97f42.firebaseapp.com',projectId:'portfolio-2026-97f42',appId:'1:104309587497:web:f595f4441098cc6e3de638'};
 let connection;
 async function connect(){
  if(!connection)connection=(async()=>{
   const [appSDK,authSDK,dbSDK]=await Promise.all([
    import('https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js'),
    import('https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js'),
    import('https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js')]);
   const app=appSDK.initializeApp(config),auth=authSDK.getAuth(app);
   await auth.authStateReady();
   const user=auth.currentUser||(await authSDK.signInAnonymously(auth)).user;
   return {sdk:dbSDK,db:dbSDK.getFirestore(app,'default'),user};
  })().catch(e=>{connection=null;throw e;});
  return connection;
 }
 window.guestbook={
  async save(record){
   if(!record.name.trim()||record.name.length>32||record.signature.length>100000)throw new Error('Please use a shorter name or a simpler signature.');
   const {sdk,db,user}=await connect(),ref=sdk.doc(db,'leaves',user.uid);
   await sdk.runTransaction(db,async tx=>{const old=await tx.get(ref);tx.set(ref,{name:record.name.trim(),colour:record.colour,signature:record.signature,createdAt:old.exists()?old.data().createdAt:sdk.serverTimestamp(),updatedAt:sdk.serverTimestamp()});});
   return user.uid;
  },
  async subscribe(onData,onError){
   try{
    const {sdk,db,user}=await connect();
    // Realtime listener keeps newly signed leaves visible without reloading.
    return sdk.onSnapshot(sdk.collection(db,'leaves'),snapshot=>{
     const entries=snapshot.docs.map(d=>({id:d.id,...d.data(),date:d.data().createdAt?.toDate().toISOString()||new Date().toISOString(),own:d.id===user.uid}));
     entries.sort((a,b)=>Date.parse(b.date)-Date.parse(a.date));onData(entries);
    },onError);
   }catch(e){onError(e);return ()=>{};}
  }
 };
})();
