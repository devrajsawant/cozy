"use client";
import Link from 'next/link';
import products from '../JsonData/products.json'
import toast from 'react-hot-toast';

export default function Home() {
  return (
    <div>
      {/* Hero section starts here */}
      <div className="flex bg-[#E6DDCB] justify-between h-[60vh]">
        <div className="flex items-center justify-center w-full">
          <div>
            <div className="text-4xl text-[#4A4946] font-serif">
              <div className="mb-2">Natural Skin Care </div>
              <div>Daily Routine</div>
            </div>
            <div className="text-lg text-[#4a4946] mt-5 font-semibold">
              Products that harness the power of 100% Nature
            </div>
           <button className="bg-[#576152] px-3 py-1 mt-5 text-white cursor-pointer hover:bg-[#3d4439]">
           <Link href={'/shop'}>
              Shop Now
           </Link>
            </button>
          </div>
        </div>
        <div className="w-full overflow-hidden object-cover">
        <img src='https://i.pinimg.com/736x/56/07/72/56077283257e200f577db7167acfee11.jpg' className='h-[100%] w-[100%] object-cover'></img>

        </div>
      </div>
      {/* category section starts here  */}
      <div className="flex bg-[#F2F1ED] items-center justify-center py-10">
        <div>
          <div className="mb-10 text-center">
            <div className="text-sm text-[#4A4946] font-semibold">
              SHOP BY CATEGORY
            </div>
            <div className="text-4xl text-[#4A4946] font-serif mt-4">
              Popular Categories
            </div>
          </div>
          <div className="flex gap-10 justify-between">
            {/* perfume cat  */}
           <Link href={'category/perfumes'}>
           <div>
              <div className=" border-3 border-dashed p-2 h-[300px] w-[170px] rounded-full">
              <div className="h-[280px] w-[150px] rounded-full overflow-hidden">
                <img
                  src="https://i.pinimg.com/736x/7e/19/07/7e1907a36a03e00eb9201997e036530b.jpg"
                  className="h-full w-full object-cover"
                />
              </div>
              </div>

              <div className="text-center mt-2 text-lg font-serif">Perfumes</div>
            </div>
           </Link>
            {/* bathing Essentials  */}
           <Link href={'category/Bathing_Products'}>
           <div>
              <div className=" border-3 border-dashed p-2 h-[300px] w-[170px] rounded-full">
              <div className="h-[280px] w-[150px] rounded-full overflow-hidden">
                <img
                  src="https://i.pinimg.com/736x/00/c0/4d/00c04d42f728348f6f9a536e66ea0009.jpg"
                  className="h-full w-full object-cover"
                />
              </div>
              </div>

              <div className="text-center mt-2 text-lg font-serif">Bathing Essentials</div>
            </div>
           </Link>
            {/* Haircare Essentials  */}
           <Link href={'category/haircare'}>
           <div>
              <div className=" border-3 border-dashed p-2 h-[300px] w-[170px] rounded-full">
              <div className="h-[280px] w-[150px] rounded-full overflow-hidden">
                <img
                  src="https://i.pinimg.com/736x/49/3f/2c/493f2c78b93838c5227cdab8e2aacb52.jpg"
                  className="h-full w-full object-cover"
                />
              </div>
              </div>

              <div className="text-center mt-2 text-lg font-serif">Hair Care</div>
            </div>
           </Link>
            {/* Skin care  */}
           <Link href={'category/skincare'}>
           <div>
              <div className=" border-3 border-dashed p-2 h-[300px] w-[170px] rounded-full">
              <div className="h-[280px] w-[150px] rounded-full overflow-hidden">
                <img
                  src="https://i.pinimg.com/736x/78/b7/9e/78b79ef9a907edfd255892082b224463.jpg"
                  className="h-full w-full object-cover"
                />
              </div>
              </div>

              <div className="text-center mt-2 text-lg font-serif">Skin Care</div>
            </div>
           </Link>
            {/* Scented Candles  */}
           <Link href={'category/candles'}>
           <div>
              <div className=" border-3 border-dashed p-2 h-[300px] w-[170px] rounded-full">
              <div className="h-[280px] w-[150px] rounded-full overflow-hidden">
                <img
                  src="https://i.pinimg.com/736x/bd/ac/37/bdac3770dcf6dd7629974542c93e7d81.jpg"
                  className="h-full w-full object-cover "
                />
              </div>
              </div>

              <div className="text-center mt-2 text-lg font-serif">Scented Candles</div>
            </div>
           </Link>
          </div>
        </div>
      </div>

      {/* hero2 section is here  */}
      <div className="flex px-10 pb-5 bg-[#F2F1ED]">
        <div className="w-full">
          <img src="https://i.pinimg.com/736x/4c/5a/17/4c5a179600244250d4c7ef09c4633dbe.jpg" className="w-[100%]"></img>
        </div>
        <div className="w-full flex justify-center items-center">
          <div className="text-center flex flex-col gap-5">
            <div className="font-mono text-sm">Best Collections of 2025</div>
            <div className="font-serif text-3xl text-[#4a4946]">Indule in <span>Cozy</span> Elegance</div>
            <div className="text-lg font-serif text-[#576152]">Surround Yourself with Scents, Skincare, and Serenity <br/>That Feel as Cozy as Home</div>
            <button className="underline text-sm">
            <Link href={'/shop'}>
              SHOP NOW
           </Link>
              </button>
          </div>
        </div>
        <div className="w-full">
          <img src="https://i.pinimg.com/736x/66/7c/99/667c99236daa06aeae5d55a88a699324.jpg" className="w-[100%]"></img>
        </div>
      </div>

      {/* Best Seller section is here  */}
      <div className='flex items-center justify-center py-10 bg-[#F2F1ED]'>
      <div className=' w-[80vw] text-center'>
        <div className='text-lg mb-2 font-mono'>Trending Products</div>
        <div className='text-2xl font-serif mb-5 '>Having a Place set aside for an Activity you love <br/> makes it more likely you'll do it</div>
        <div className="flex flex-col gap-4">
  {/* First Row */}
  <div className="flex justify-center gap-5">
    {products.slice(0, 4).map((product) => (
      <Link key={product.id} href={`/product/${product.id}`}>
      <div  className="h-[300px] w-[200px] bg-[#E5E2DB] p-3 hover:bg-[#d7d6d2] transition-all ease-in-out duration-300">
        <img src={product.image} alt={product.name} className="h-[80%] w-full object-cover pb-2 border-b border-[#4a4946]" />
        <p className="text-center text-xs font-mono mt-2">{product.name}</p>
        <p className="text-center">₹ {product.price}<span className='text-[0.75em]'>.00/-</span></p>
      </div>
      </Link>
    ))}
  </div>

  {/* Second Row */}
  <div className="flex justify-center gap-5">
    {products.slice(4, 8).map((product) => (
      <Link key={product.id} href={`/product/${product.id}`}>
      <div  className="h-[300px] w-[200px] bg-[#E5E2DB] p-3 hover:bg-[#d7d6d2] transition-all ease-in-out duration-300">
        <img src={product.image} alt={product.name} className="h-[80%] w-full object-cover pb-2 border-b border-[#4a4946]" />
        <p className="text-center text-xs font-mono mt-2">{product.name}</p>
        <p className="text-center">₹ {product.price}<span className='text-[0.75em]'>.00/-</span></p>
      </div>
      </Link>
    ))}
  </div>

<Link href={'/shop'}>  <button className='cursor-pointer border border-[#4b4945] w-fit mx-auto px-1.5 py-1 mt-4 font-mono'>Explore more</button>
</Link>
        </div>

      </div>
      </div>

      {/* newsletter section  */}
      <div className='flex h-[50vh] bg-[#F2F1ED]'>
        <div className='w-full flex items-center justify-center'>
            <div>
              <div className='text-2xl mb-3 font-serif'> Subscribe To our Cozy Newsletter</div>
              <div className='flex'>
                <input type='text' className=' border border-[#4a4946] w-xl py-3'></input>
                <button className='px-5 py-1 bg-[#5D2E15] text-[#F2F1ED]' onClick={()=> toast.success('subscribed to Cozy Newsletter')}>Subscribe</button>
                </div>
            </div>
        </div>
        <div className='w-full'>
          <img src='https://i.pinimg.com/736x/6f/cc/63/6fcc63fe708b8bc74982176aacfaa87b.jpg' className='object-cover h-[90%] w-[85%] object-center'></img>
        </div>
      </div>
    </div>
  );
}
